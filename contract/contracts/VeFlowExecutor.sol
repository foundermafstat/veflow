// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VeFlowAccessControl.sol";

/**
 * @title VeFlowExecutor
 * @dev Handles step execution and safe external calls
 */
contract VeFlowExecutor is VeFlowAccessControl {
    // Endpoint structure
    struct Endpoint {
        address target;
        bytes4 selector;
        bool active;
    }

    // Events
    event EndpointRegistered(bytes32 indexed endpointId, address target, bytes4 selector);
    event EndpointDeactivated(bytes32 indexed endpointId);
    event ExternalCallExecuted(bytes32 indexed endpointId, bool success, bytes result);

    // State variables
    mapping(bytes32 => Endpoint) public endpoints;
    mapping(address => bool) public authorizedCallers;

    /**
     * @dev Register an endpoint for external calls
     * @param endpointId Unique identifier for the endpoint
     * @param target Target contract address
     * @param selector Function selector
     */
    function registerEndpoint(
        bytes32 endpointId, 
        address target, 
        bytes4 selector
    ) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        whenNotPaused 
    {
        require(target != address(0), "Invalid target address");
        require(selector != bytes4(0), "Invalid function selector");

        endpoints[endpointId] = Endpoint({
            target: target,
            selector: selector,
            active: true
        });

        emit EndpointRegistered(endpointId, target, selector);
    }

    /**
     * @dev Deactivate an endpoint
     * @param endpointId ID of the endpoint to deactivate
     */
    function deactivateEndpoint(bytes32 endpointId) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        whenNotPaused 
    {
        require(endpoints[endpointId].target != address(0), "Endpoint does not exist");
        
        endpoints[endpointId].active = false;
        emit EndpointDeactivated(endpointId);
    }

    /**
     * @dev Execute external call through registered endpoint
     * @param endpointId ID of the endpoint
     * @param data Calldata for the external call
     * @return success Whether the call was successful
     * @return result Return data from the call
     */
    function executeExternalCall(
        bytes32 endpointId, 
        bytes calldata data
    ) 
        external 
        onlyRole(EXECUTOR_ROLE) 
        whenNotPaused 
        nonReentrant 
        returns (bool success, bytes memory result) 
    {
        Endpoint memory endpoint = endpoints[endpointId];
        require(endpoint.target != address(0), "Endpoint does not exist");
        require(endpoint.active, "Endpoint is not active");

        // Verify the function selector matches
        require(
            bytes4(data[0:4]) == endpoint.selector, 
            "Function selector mismatch"
        );

        // Execute the external call
        (success, result) = endpoint.target.call(data);

        emit ExternalCallExecuted(endpointId, success, result);
    }

    /**
     * @dev Get endpoint information
     * @param endpointId ID of the endpoint
     * @return endpoint The endpoint struct
     */
    function getEndpoint(bytes32 endpointId) external view returns (Endpoint memory endpoint) {
        require(endpoints[endpointId].target != address(0), "Endpoint does not exist");
        return endpoints[endpointId];
    }

    /**
     * @dev Check if endpoint exists and is active
     * @param endpointId ID of the endpoint
     * @return exists True if endpoint exists
     * @return active True if endpoint is active
     */
    function isEndpointValid(bytes32 endpointId) external view returns (bool exists, bool active) {
        exists = endpoints[endpointId].target != address(0);
        active = exists && endpoints[endpointId].active;
    }

    /**
     * @dev Authorize caller for special operations
     * @param caller Address to authorize
     */
    function authorizeCaller(address caller) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authorizedCallers[caller] = true;
    }

    /**
     * @dev Revoke authorization for caller
     * @param caller Address to revoke authorization
     */
    function revokeCaller(address caller) external onlyRole(DEFAULT_ADMIN_ROLE) {
        authorizedCallers[caller] = false;
    }

    /**
     * @dev Check if caller is authorized
     * @param caller Address to check
     * @return authorized True if caller is authorized
     */
    function isAuthorizedCaller(address caller) external view returns (bool authorized) {
        return authorizedCallers[caller];
    }

    /**
     * @dev Emergency function to recover stuck funds
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to recover
     */
    function emergencyRecover(address token, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        nonReentrant 
    {
        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            payable(msg.sender).transfer(amount);
        } else {
            // For ERC20 tokens, would need IERC20 interface
            // This is a placeholder for future implementation
            revert("Token recovery not implemented");
        }
    }
}


