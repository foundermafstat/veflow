// API functions for blueprint operations

import { Blueprint, BlueprintWithMetadata, FlowExecution, CreateFlowData } from '@/types/blueprint.types'
import { getVeChainProvider, VeChainNetwork } from './vechain-provider'
import { RegistryService } from './services/registry-service'
import { OrchestratorService } from './services/orchestrator-service'
import { BillingService } from './services/billing-service'

// Mock ABI functions - в реальном приложении будет импортироваться из artifacts
const BLUEPRINT_ABI = [
  {
    "inputs": [],
    "name": "getBlueprintCount",
    "outputs": [{"internalType": "uint256", "name": "count", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "getBlueprint",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "author", "type": "address"},
        {"internalType": "string", "name": "metadataURI", "type": "string"},
        {"internalType": "uint16", "name": "version", "type": "uint16"},
        {"internalType": "bool", "name": "active", "type": "bool"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
      ],
      "internalType": "struct VeFlowRegistry.Blueprint",
      "name": "blueprint",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "isBlueprintValid",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const ORCHESTRATOR_ABI = [
  {
    "inputs": [{"internalType": "uint256[]", "name": "orderedBlueprintIds", "type": "uint256[]"}],
    "name": "linkBlueprints",
    "outputs": [{"internalType": "uint256", "name": "flowId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "flowId", "type": "uint256"}],
    "name": "getFlowBlueprints",
    "outputs": [{"internalType": "uint256[]", "name": "blueprintIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "flowId", "type": "uint256"}, {"internalType": "bytes", "name": "input", "type": "bytes"}],
    "name": "startFlow",
    "outputs": [{"internalType": "uint256", "name": "executionId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
]

// Mock metadata fetching function
async function fetchBlueprintMetadata(metadataURI: string): Promise<any> {
  // В реальном приложении будет загружать метаданные из IPFS или другого хранилища
  console.log(`Fetching metadata from: ${metadataURI}`)
  
  // Mock metadata based on URI
  const mockMetadata = {
    "ipfs://QmBlueprint1": {
      name: "HTTP Request",
      description: "Отправляет HTTP запрос к внешнему API",
      category: "web",
      tags: ["api", "http", "request"],
      inputs: [
        { name: "url", type: "string", required: true, description: "URL для запроса" },
        { name: "method", type: "string", required: false, defaultValue: "GET", description: "HTTP метод" }
      ],
      outputs: [
        { name: "response", type: "string", description: "Ответ от сервера" },
        { name: "status", type: "number", description: "HTTP статус код" }
      ],
      icon: "Globe",
      color: "blue",
      complexity: "simple",
      estimatedGas: 50000
    },
    "ipfs://QmBlueprint2": {
      name: "Database Query",
      description: "Выполняет запрос к базе данных",
      category: "database",
      tags: ["database", "sql", "query"],
      inputs: [
        { name: "query", type: "string", required: true, description: "SQL запрос" },
        { name: "connection", type: "string", required: true, description: "Строка подключения" }
      ],
      outputs: [
        { name: "result", type: "string", description: "Результат запроса" }
      ],
      icon: "Database",
      color: "green",
      complexity: "medium",
      estimatedGas: 100000
    }
  }
  
  return mockMetadata[metadataURI as keyof typeof mockMetadata] || {
    name: "Unknown Blueprint",
    description: "Blueprint metadata not found",
    category: "unknown",
    tags: [],
    inputs: [],
    outputs: [],
    icon: "Settings",
    color: "gray",
    complexity: "simple",
    estimatedGas: 0
  }
}

// Blueprint API functions
export class BlueprintAPI {
  private provider: any // VeChain provider
  private registryService: RegistryService
  private orchestratorService: OrchestratorService
  private billingService: BillingService
  private network: VeChainNetwork
  
  constructor(provider: any, network: VeChainNetwork = 'testnet') {
    this.provider = provider
    this.network = network
    
    // Initialize services
    this.registryService = new RegistryService(provider, network)
    this.orchestratorService = new OrchestratorService(provider, network)
    this.billingService = new BillingService(provider, network)
  }

  /**
   * Get all available blueprints
   */
  async getAllBlueprints(): Promise<BlueprintWithMetadata[]> {
    try {
      console.log("Fetching all blueprints from contract...")
      return await this.registryService.getBlueprintsWithMetadata()
    } catch (error) {
      console.error("Error fetching blueprints:", error)
      throw error
    }
  }

  /**
   * Get blueprint by ID
   */
  async getBlueprint(blueprintId: number): Promise<BlueprintWithMetadata | null> {
    try {
      console.log(`Fetching blueprint ${blueprintId} from contract...`)
      
      const blueprint = await this.registryService.getBlueprint(blueprintId)
      if (!blueprint) {
        return null
      }

      // Fetch metadata
      const metadata = await fetchBlueprintMetadata(blueprint.metadataURI)
      return {
        ...blueprint,
        metadata
      }
    } catch (error) {
      console.error(`Error fetching blueprint ${blueprintId}:`, error)
      return null
    }
  }

  /**
   * Create a new flow from blueprints
   */
  async createFlow(flowData: CreateFlowData): Promise<{ flowId: number; txHash: string }> {
    try {
      console.log("Creating flow from blueprints:", flowData)
      return await this.orchestratorService.createFlow(flowData)
    } catch (error) {
      console.error("Error creating flow:", error)
      throw error
    }
  }

  /**
   * Start flow execution
   */
  async startFlowExecution(flowId: number, inputData: string, payment: string): Promise<{ executionId: number; txHash: string }> {
    try {
      console.log(`Starting flow execution for flow ${flowId}`)
      return await this.orchestratorService.startFlowExecution(flowId, inputData, payment)
    } catch (error) {
      console.error("Error starting flow execution:", error)
      throw error
    }
  }

  /**
   * Get flow blueprints
   */
  async getFlowBlueprints(flowId: number): Promise<number[]> {
    try {
      console.log(`Fetching blueprints for flow ${flowId}`)
      return await this.orchestratorService.getFlowBlueprints(flowId)
    } catch (error) {
      console.error(`Error fetching flow blueprints for flow ${flowId}:`, error)
      throw error
    }
  }

  /**
   * Validate blueprint exists and is active
   */
  async validateBlueprint(blueprintId: number): Promise<{ exists: boolean; active: boolean }> {
    try {
      console.log(`Validating blueprint ${blueprintId}`)
      return await this.registryService.isBlueprintValid(blueprintId)
    } catch (error) {
      console.error(`Error validating blueprint ${blueprintId}:`, error)
      throw error
    }
  }
}

// Factory function to create API instance
export function createBlueprintAPI(provider: any, network: VeChainNetwork = 'testnet'): BlueprintAPI {
  return new BlueprintAPI(provider, network)
}

// Hook for using blueprint API in React components
export function useBlueprintAPI(network: VeChainNetwork = 'testnet') {
  const provider = getVeChainProvider(network)
  return createBlueprintAPI(provider, network)
}

// Additional methods for billing and execution management
export class BlueprintAPIExtended extends BlueprintAPI {
  /**
   * Get billing information
   */
  async getBillingInfo() {
    const billingService = new BillingService(this['provider'], this['network'])
    return await billingService.getBillingInfo()
  }

  /**
   * Deposit funds for flow execution
   */
  async depositFunds(amount: string) {
    const billingService = new BillingService(this['provider'], this['network'])
    return await billingService.deposit(amount)
  }

  /**
   * Calculate flow execution cost
   */
  async calculateFlowCost(blueprintIds: number[]) {
    const billingService = new BillingService(this['provider'], this['network'])
    return await billingService.calculateTotalFlowFee(blueprintIds)
  }

  /**
   * Check if user can execute flow
   */
  async canExecuteFlow(blueprintIds: number[]) {
    const billingService = new BillingService(this['provider'], this['network'])
    return await billingService.canExecuteFlow(blueprintIds)
  }

  /**
   * Get flow execution status
   */
  async getFlowExecutionStatus(executionId: number) {
    const orchestratorService = new OrchestratorService(this['provider'], this['network'])
    return await orchestratorService.getFlowExecutionStatus(executionId)
  }

  /**
   * Get user's flow executions
   */
  async getMyExecutions() {
    const orchestratorService = new OrchestratorService(this['provider'], this['network'])
    return await orchestratorService.getMyExecutions()
  }

  /**
   * Register a new blueprint
   */
  async registerBlueprint(metadataURI: string) {
    const registryService = new RegistryService(this['provider'], this['network'])
    return await registryService.registerBlueprint(metadataURI)
  }

  /**
   * Update an existing blueprint
   */
  async updateBlueprint(blueprintId: number, metadataURI: string) {
    const registryService = new RegistryService(this['provider'], this['network'])
    return await registryService.updateBlueprint(blueprintId, metadataURI)
  }
}
