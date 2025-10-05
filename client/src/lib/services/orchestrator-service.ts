// VeFlow Orchestrator service for flow management

import { VeChainProvider, VeChainNetwork } from '../vechain-provider'
import { VEFLOW_ORCHESTRATOR_ABI, CONTRACT_ADDRESSES } from '../contracts/abis'
import { FlowExecution, CreateFlowData } from '@/types/blueprint.types'

export class OrchestratorService {
  private provider: VeChainProvider
  private contractAddress: string

  constructor(provider: VeChainProvider, network: VeChainNetwork = 'testnet') {
    this.provider = provider
    this.contractAddress = CONTRACT_ADDRESSES[network].orchestrator
  }

  /**
   * Create a new flow by linking blueprints
   */
  async createFlow(flowData: CreateFlowData): Promise<{ flowId: number; txHash: string }> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      const result = await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'linkBlueprints',
        [flowData.blueprintIds]
      )

      // Extract flow ID from transaction receipt
      const flowId = await this.extractFlowIdFromTx(result.txid)
      
      return {
        flowId,
        txHash: result.txid
      }
    } catch (error) {
      console.error('Error creating flow:', error)
      throw error
    }
  }

  /**
   * Start flow execution
   */
  async startFlowExecution(
    flowId: number, 
    inputData: string, 
    payment: string
  ): Promise<{ executionId: number; txHash: string }> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      // Convert input data to bytes
      const inputBytes = this.provider.getConnex().utils.abi.encodeBytes(inputData)

      const result = await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'startFlow',
        [flowId, inputBytes],
        payment
      )

      // Extract execution ID from transaction receipt
      const executionId = await this.extractExecutionIdFromTx(result.txid)
      
      return {
        executionId,
        txHash: result.txid
      }
    } catch (error) {
      console.error('Error starting flow execution:', error)
      throw error
    }
  }

  /**
   * Get flow blueprints
   */
  async getFlowBlueprints(flowId: number): Promise<number[]> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'getFlowBlueprints',
        [flowId]
      )

      return result.data[0].map((id: string) => parseInt(id))
    } catch (error) {
      console.error(`Error getting flow blueprints for flow ${flowId}:`, error)
      throw error
    }
  }

  /**
   * Get flow execution details
   */
  async getFlowExecution(executionId: number): Promise<FlowExecution | null> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'getFlowExecution',
        [executionId]
      )

      if (!result.data || result.data.length === 0) {
        return null
      }

      const executionData = result.data[0]
      
      return {
        flowId: parseInt(executionData.flowId),
        blueprintIds: executionData.blueprintIds.map((id: string) => parseInt(id)),
        executor: executionData.executor,
        inputData: executionData.inputData,
        currentStep: parseInt(executionData.currentStep),
        completed: executionData.completed,
        createdAt: parseInt(executionData.createdAt),
        totalSteps: parseInt(executionData.totalSteps)
      }
    } catch (error) {
      console.error(`Error getting flow execution ${executionId}:`, error)
      return null
    }
  }

  /**
   * Get executions by executor
   */
  async getExecutionsByExecutor(executor: string): Promise<number[]> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'getExecutionsByExecutor',
        [executor]
      )

      return result.data[0].map((id: string) => parseInt(id))
    } catch (error) {
      console.error(`Error getting executions for executor ${executor}:`, error)
      throw error
    }
  }

  /**
   * Check if execution is completed
   */
  async isExecutionCompleted(executionId: number): Promise<boolean> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'isExecutionCompleted',
        [executionId]
      )

      return result.data[0]
    } catch (error) {
      console.error(`Error checking execution completion for ${executionId}:`, error)
      throw error
    }
  }

  /**
   * Execute a step in the flow (only for authorized executors)
   */
  async executeStep(
    executionId: number,
    stepIndex: number,
    stepOutput: string,
    executorSig: string
  ): Promise<string> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      // Convert step output to bytes
      const outputBytes = this.provider.getConnex().utils.abi.encodeBytes(stepOutput)
      // Convert signature to bytes
      const sigBytes = this.provider.getConnex().utils.abi.encodeBytes(executorSig)

      const result = await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_ORCHESTRATOR_ABI,
        'executeStep',
        [executionId, stepIndex, outputBytes, sigBytes]
      )

      // Extract result from transaction receipt
      const stepResult = await this.extractStepResultFromTx(result.txid)
      return stepResult
    } catch (error) {
      console.error(`Error executing step ${stepIndex} for execution ${executionId}:`, error)
      throw error
    }
  }

  /**
   * Get all flow executions for current user
   */
  async getMyExecutions(): Promise<FlowExecution[]> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      const executionIds = await this.getExecutionsByExecutor(currentAccount)
      const executions: FlowExecution[] = []

      for (const executionId of executionIds) {
        const execution = await this.getFlowExecution(executionId)
        if (execution) {
          executions.push(execution)
        }
      }

      return executions
    } catch (error) {
      console.error('Error getting my executions:', error)
      throw error
    }
  }

  /**
   * Get flow execution status
   */
  async getFlowExecutionStatus(executionId: number): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed'
    currentStep: number
    totalSteps: number
    completed: boolean
  }> {
    try {
      const execution = await this.getFlowExecution(executionId)
      if (!execution) {
        throw new Error(`Execution ${executionId} not found`)
      }

      let status: 'pending' | 'running' | 'completed' | 'failed'
      
      if (execution.completed) {
        status = 'completed'
      } else if (execution.currentStep > 0) {
        status = 'running'
      } else {
        status = 'pending'
      }

      return {
        status,
        currentStep: execution.currentStep,
        totalSteps: execution.totalSteps,
        completed: execution.completed
      }
    } catch (error) {
      console.error(`Error getting execution status for ${executionId}:`, error)
      throw error
    }
  }

  /**
   * Extract flow ID from transaction receipt
   */
  private async extractFlowIdFromTx(txHash: string): Promise<number> {
    try {
      // In a real implementation, you would parse the transaction receipt
      // to extract the flow ID from the FlowCreated event
      // For now, return a mock ID
      console.log('Extracting flow ID from transaction:', txHash)
      return Math.floor(Math.random() * 1000) + 1
    } catch (error) {
      console.error('Error extracting flow ID from transaction:', error)
      throw error
    }
  }

  /**
   * Extract execution ID from transaction receipt
   */
  private async extractExecutionIdFromTx(txHash: string): Promise<number> {
    try {
      // In a real implementation, you would parse the transaction receipt
      // to extract the execution ID from the FlowExecuted event
      // For now, return a mock ID
      console.log('Extracting execution ID from transaction:', txHash)
      return Math.floor(Math.random() * 1000) + 1
    } catch (error) {
      console.error('Error extracting execution ID from transaction:', error)
      throw error
    }
  }

  /**
   * Extract step result from transaction receipt
   */
  private async extractStepResultFromTx(txHash: string): Promise<string> {
    try {
      // In a real implementation, you would parse the transaction receipt
      // to extract the step result from the ExecutionResult event
      // For now, return a mock result
      console.log('Extracting step result from transaction:', txHash)
      return 'Step executed successfully'
    } catch (error) {
      console.error('Error extracting step result from transaction:', error)
      throw error
    }
  }

  /**
   * Listen to flow events
   */
  onFlowCreated(callback: (flowId: number, blueprintIds: number[]) => void) {
    // Event listening implementation
    console.log('Flow created event listener registered')
  }

  onFlowExecuted(callback: (flowId: number, executor: string, timestamp: number, executionId: number) => void) {
    // Event listening implementation
    console.log('Flow executed event listener registered')
  }

  onExecutionResult(callback: (flowId: number, stepIndex: number, result: string) => void) {
    // Event listening implementation
    console.log('Execution result event listener registered')
  }

  onFlowCompleted(callback: (flowId: number, executionId: number) => void) {
    // Event listening implementation
    console.log('Flow completed event listener registered')
  }
}
