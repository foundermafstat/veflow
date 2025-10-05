// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VeFlowRegistry.sol";
import "./VeFlowBilling.sol";

/**
 * @title VeFlowOrchestrator
 * @dev Orchestrates flow execution and emits events for off-chain workers
 */
contract VeFlowOrchestrator is VeFlowAccessControl {
    // Flow execution structure
    struct FlowExecution {
        uint256 flowId;
        uint256[] blueprintIds;
        address executor;
        bytes inputData;
        uint256 currentStep;
        bool completed;
        uint256 createdAt;
        uint256 totalSteps;
    }

    // State variables
    VeFlowRegistry public registry;
    VeFlowBilling public billing;
    uint256 private _nextFlowId = 1;
    uint256 private _nextExecutionId = 1;
    
    mapping(uint256 => FlowExecution) public flowExecutions;
    mapping(uint256 => uint256[]) public flowBlueprints; // flowId => blueprintIds
    mapping(address => uint256[]) public executorFlows;

    // Events
    event FlowCreated(uint256 indexed flowId, uint256[] blueprintIds);
    event FlowExecuted(uint256 indexed flowId, address indexed executor, uint256 timestamp, uint256 executionId);
    event ExecutionResult(uint256 indexed flowId, uint256 stepIndex, bytes result);
    event FlowCompleted(uint256 indexed flowId, uint256 executionId);

    constructor(address _registry, address _billing) {
        registry = VeFlowRegistry(_registry);
        billing = VeFlowBilling(_billing);
    }

    /**
     * @dev Link blueprints to create a flow
     * @param orderedBlueprintIds Array of blueprint IDs in execution order
     * @return flowId ID of the created flow
     */
    function linkBlueprints(uint256[] calldata orderedBlueprintIds) 
        external 
        whenNotPaused 
        onlyRole(AUTHOR_ROLE) 
        returns (uint256 flowId) 
    {
        require(orderedBlueprintIds.length > 0, "Flow must have at least one blueprint");
        
        flowId = _nextFlowId++;
        flowBlueprints[flowId] = orderedBlueprintIds;

        // Validate all blueprints exist and are active
        for (uint256 i = 0; i < orderedBlueprintIds.length; i++) {
            (bool exists, bool active) = registry.isBlueprintValid(orderedBlueprintIds[i]);
            require(exists && active, "Invalid blueprint in flow");
        }

        emit FlowCreated(flowId, orderedBlueprintIds);
    }

    /**
     * @dev Start execution of a flow
     * @param flowId ID of the flow to execute
     * @param input Initial input data for the flow
     * @return executionId ID of the execution instance
     */
    function startFlow(uint256 flowId, bytes calldata input) 
        external 
        payable 
        whenNotPaused 
        returns (uint256 executionId) 
    {
        require(flowBlueprints[flowId].length > 0, "Flow does not exist");
        require(msg.value > 0, "Payment required to start flow");

        // Deposit payment
        billing.deposit{value: msg.value}(msg.sender);

        executionId = _nextExecutionId++;
        
        FlowExecution storage execution = flowExecutions[executionId];
        execution.flowId = flowId;
        execution.blueprintIds = flowBlueprints[flowId];
        execution.executor = msg.sender;
        execution.inputData = input;
        execution.currentStep = 0;
        execution.completed = false;
        execution.createdAt = block.timestamp;
        execution.totalSteps = flowBlueprints[flowId].length;

        executorFlows[msg.sender].push(executionId);

        emit FlowExecuted(flowId, msg.sender, block.timestamp, executionId);
    }

    /**
     * @dev Execute a step in the flow
     * @param executionId ID of the execution
     * @param stepIndex Index of the step to execute
     * @param stepOutput Output data from the step execution
     * @param executorSig Signature from authorized executor
     * @return result Result of the step execution
     */
    function executeStep(
        uint256 executionId, 
        uint256 stepIndex, 
        bytes calldata stepOutput, 
        bytes calldata executorSig
    ) 
        external 
        whenNotPaused 
        onlyRole(EXECUTOR_ROLE) 
        returns (bytes memory result) 
    {
        FlowExecution storage execution = flowExecutions[executionId];
        require(execution.flowId != 0, "Execution does not exist");
        require(!execution.completed, "Execution already completed");
        require(stepIndex == execution.currentStep, "Invalid step index");
        require(stepIndex < execution.totalSteps, "Step index out of bounds");

        // Deduct step fee if applicable
        uint256 blueprintId = execution.blueprintIds[stepIndex];
        uint256 stepFee = billing.getStepFee(blueprintId);
        if (stepFee > 0) {
            billing.deductFee(execution.executor, stepFee, "Step execution fee");
        }

        // Update execution state
        execution.currentStep++;
        if (execution.currentStep >= execution.totalSteps) {
            execution.completed = true;
            emit FlowCompleted(execution.flowId, executionId);
        }

        result = stepOutput;
        emit ExecutionResult(execution.flowId, stepIndex, result);
    }

    /**
     * @dev Get flow execution details
     * @param executionId ID of the execution
     * @return execution The execution struct
     */
    function getFlowExecution(uint256 executionId) external view returns (FlowExecution memory execution) {
        require(flowExecutions[executionId].flowId != 0, "Execution does not exist");
        return flowExecutions[executionId];
    }

    /**
     * @dev Get flow blueprints
     * @param flowId ID of the flow
     * @return blueprintIds Array of blueprint IDs
     */
    function getFlowBlueprints(uint256 flowId) external view returns (uint256[] memory blueprintIds) {
        require(flowBlueprints[flowId].length > 0, "Flow does not exist");
        return flowBlueprints[flowId];
    }

    /**
     * @dev Get executions by executor
     * @param executor Address of the executor
     * @return executionIds Array of execution IDs
     */
    function getExecutionsByExecutor(address executor) external view returns (uint256[] memory executionIds) {
        return executorFlows[executor];
    }

    /**
     * @dev Check if execution is completed
     * @param executionId ID of the execution
     * @return completed True if execution is completed
     */
    function isExecutionCompleted(uint256 executionId) external view returns (bool completed) {
        return flowExecutions[executionId].completed;
    }
}


