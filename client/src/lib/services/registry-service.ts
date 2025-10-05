// VeFlow Registry service for blueprint management

import { VeChainProvider, VeChainNetwork } from '../vechain-provider'
import { VEFLOW_REGISTRY_ABI, CONTRACT_ADDRESSES } from '../contracts/abis'
import { Blueprint, BlueprintWithMetadata } from '@/types/blueprint.types'

export class RegistryService {
  private provider: VeChainProvider
  private contractAddress: string

  constructor(provider: VeChainProvider, network: VeChainNetwork = 'testnet') {
    this.provider = provider
    this.contractAddress = CONTRACT_ADDRESSES[network].registry
  }

  /**
   * Get total number of blueprints
   */
  async getBlueprintCount(): Promise<number> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'getBlueprintCount',
        []
      )
      
      return parseInt(result.data[0])
    } catch (error) {
      console.error('Error getting blueprint count:', error)
      throw error
    }
  }

  /**
   * Get blueprint by ID
   */
  async getBlueprint(blueprintId: number): Promise<Blueprint | null> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'getBlueprint',
        [blueprintId]
      )

      if (!result.data || result.data.length === 0) {
        return null
      }

      const blueprintData = result.data[0]
      
      return {
        id: parseInt(blueprintData.id),
        author: blueprintData.author,
        metadataURI: blueprintData.metadataURI,
        version: parseInt(blueprintData.version),
        active: blueprintData.active,
        createdAt: parseInt(blueprintData.createdAt)
      }
    } catch (error) {
      console.error(`Error getting blueprint ${blueprintId}:`, error)
      return null
    }
  }

  /**
   * Get all blueprints
   */
  async getAllBlueprints(): Promise<Blueprint[]> {
    try {
      const count = await this.getBlueprintCount()
      const blueprints: Blueprint[] = []

      // Fetch all blueprints in batches
      const batchSize = 10
      for (let i = 1; i <= count; i += batchSize) {
        const batchPromises = []
        const endIndex = Math.min(i + batchSize - 1, count)
        
        for (let j = i; j <= endIndex; j++) {
          batchPromises.push(this.getBlueprint(j))
        }
        
        const batchResults = await Promise.all(batchPromises)
        blueprints.push(...batchResults.filter((bp): bp is Blueprint => bp !== null))
      }

      return blueprints
    } catch (error) {
      console.error('Error getting all blueprints:', error)
      throw error
    }
  }

  /**
   * Get blueprints by author
   */
  async getBlueprintsByAuthor(author: string): Promise<number[]> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'getBlueprintsByAuthor',
        [author]
      )

      return result.data[0].map((id: string) => parseInt(id))
    } catch (error) {
      console.error(`Error getting blueprints by author ${author}:`, error)
      throw error
    }
  }

  /**
   * Check if blueprint exists and is active
   */
  async isBlueprintValid(blueprintId: number): Promise<{ exists: boolean; active: boolean }> {
    try {
      const result = await this.provider.callContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'isBlueprintValid',
        [blueprintId]
      )

      return {
        exists: result.data[0],
        active: result.data[1]
      }
    } catch (error) {
      console.error(`Error validating blueprint ${blueprintId}:`, error)
      throw error
    }
  }

  /**
   * Register a new blueprint
   */
  async registerBlueprint(metadataURI: string): Promise<number> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      const result = await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'registerBlueprint',
        [metadataURI]
      )

      // Extract blueprint ID from transaction receipt
      const blueprintId = await this.extractBlueprintIdFromTx(result.txid)
      return blueprintId
    } catch (error) {
      console.error('Error registering blueprint:', error)
      throw error
    }
  }

  /**
   * Update an existing blueprint
   */
  async updateBlueprint(blueprintId: number, metadataURI: string): Promise<void> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'updateBlueprint',
        [blueprintId, metadataURI]
      )
    } catch (error) {
      console.error(`Error updating blueprint ${blueprintId}:`, error)
      throw error
    }
  }

  /**
   * Deactivate a blueprint
   */
  async deactivateBlueprint(blueprintId: number): Promise<void> {
    try {
      const currentAccount = this.provider.getCurrentAccount()
      if (!currentAccount) {
        throw new Error('Wallet not connected')
      }

      await this.provider.executeContractMethod(
        this.contractAddress,
        VEFLOW_REGISTRY_ABI,
        'deactivateBlueprint',
        [blueprintId]
      )
    } catch (error) {
      console.error(`Error deactivating blueprint ${blueprintId}:`, error)
      throw error
    }
  }

  /**
   * Get blueprints with metadata
   */
  async getBlueprintsWithMetadata(): Promise<BlueprintWithMetadata[]> {
    try {
      const blueprints = await this.getAllBlueprints()
      const blueprintsWithMetadata: BlueprintWithMetadata[] = []

      for (const blueprint of blueprints) {
        try {
          const metadata = await this.fetchBlueprintMetadata(blueprint.metadataURI)
          blueprintsWithMetadata.push({
            ...blueprint,
            metadata
          })
        } catch (error) {
          console.error(`Error fetching metadata for blueprint ${blueprint.id}:`, error)
          // Add blueprint without metadata
          blueprintsWithMetadata.push({
            ...blueprint,
            metadata: {
              name: 'Unknown Blueprint',
              description: 'Metadata not available',
              category: 'unknown',
              tags: [],
              inputs: [],
              outputs: [],
              icon: 'Settings',
              color: 'gray',
              complexity: 'simple',
              estimatedGas: 0
            }
          })
        }
      }

      return blueprintsWithMetadata
    } catch (error) {
      console.error('Error getting blueprints with metadata:', error)
      throw error
    }
  }

  /**
   * Fetch blueprint metadata from URI
   */
  private async fetchBlueprintMetadata(metadataURI: string): Promise<any> {
    try {
      // Handle different URI schemes
      if (metadataURI.startsWith('ipfs://')) {
        const ipfsHash = metadataURI.replace('ipfs://', '')
        // In a real implementation, you would fetch from IPFS
        // For now, return mock data
        return this.getMockMetadata(ipfsHash)
      } else if (metadataURI.startsWith('http://') || metadataURI.startsWith('https://')) {
        // Fetch from HTTP/HTTPS URL
        const response = await fetch(metadataURI)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } else {
        throw new Error(`Unsupported metadata URI scheme: ${metadataURI}`)
      }
    } catch (error) {
      console.error(`Error fetching metadata from ${metadataURI}:`, error)
      throw error
    }
  }

  /**
   * Get mock metadata for development
   */
  private getMockMetadata(ipfsHash: string): any {
    // Mock metadata based on IPFS hash
    const mockMetadataMap: Record<string, any> = {
      'QmBlueprint1': {
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
      'QmBlueprint2': {
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
      },
      'QmBlueprint3': {
        name: "Smart Contract Call",
        description: "Вызывает функцию смартконтракта",
        category: "blockchain",
        tags: ["smart-contract", "blockchain", "call"],
        inputs: [
          { name: "contractAddress", type: "address", required: true, description: "Адрес контракта" },
          { name: "functionName", type: "string", required: true, description: "Название функции" },
          { name: "parameters", type: "string", required: false, description: "Параметры функции" }
        ],
        outputs: [
          { name: "result", type: "bytes", description: "Результат вызова" }
        ],
        icon: "Shield",
        color: "purple",
        complexity: "complex",
        estimatedGas: 200000
      }
    }

    return mockMetadataMap[ipfsHash] || {
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

  /**
   * Extract blueprint ID from transaction receipt
   */
  private async extractBlueprintIdFromTx(txHash: string): Promise<number> {
    try {
      // In a real implementation, you would parse the transaction receipt
      // to extract the blueprint ID from the BlueprintRegistered event
      // For now, return a mock ID
      console.log('Extracting blueprint ID from transaction:', txHash)
      return Math.floor(Math.random() * 1000) + 1
    } catch (error) {
      console.error('Error extracting blueprint ID from transaction:', error)
      throw error
    }
  }

  /**
   * Listen to blueprint events
   */
  onBlueprintRegistered(callback: (blueprintId: number, author: string, version: number) => void) {
    // Event listening implementation
    // This would need to be implemented based on VeChain event listening
    console.log('Blueprint registered event listener registered')
  }

  onBlueprintUpdated(callback: (blueprintId: number, version: number) => void) {
    // Event listening implementation
    console.log('Blueprint updated event listener registered')
  }

  onBlueprintDeactivated(callback: (blueprintId: number) => void) {
    // Event listening implementation
    console.log('Blueprint deactivated event listener registered')
  }
}
