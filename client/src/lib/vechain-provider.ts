// VeChain Web3 provider and utilities

import { MAINNET_NETWORK, TESTNET_NETWORK } from '@vechain/sdk-core'
import { ThorClient } from '@vechain/sdk-network'

// VeChain network configurations
export const VECHAIN_NETWORKS = {
  testnet: {
    name: 'VeChain Testnet',
    rpcUrl: 'https://testnet.vechain.org',
    chainId: '0x27', // 39 in decimal
    blockExplorer: 'https://explore-testnet.vechain.org',
    nativeCurrency: {
      name: 'VET',
      symbol: 'VET',
      decimals: 18,
    },
  },
  mainnet: {
    name: 'VeChain Mainnet',
    rpcUrl: 'https://mainnet.vechain.org',
    chainId: '0x26', // 38 in decimal
    blockExplorer: 'https://explore.vechain.org',
    nativeCurrency: {
      name: 'VET',
      symbol: 'VET',
      decimals: 18,
    },
  },
} as const

export type VeChainNetwork = keyof typeof VECHAIN_NETWORKS

// VeChain provider class
export class VeChainProvider {
  private thor: any = null
  private network: VeChainNetwork = 'testnet'
  private isConnected = false

  constructor(network: VeChainNetwork = 'testnet') {
    this.network = network
    this.initializeThor()
  }

  private initializeThor() {
    try {
      // Initialize Thor client for VeChain using new SDK
      const networkConfig = VECHAIN_NETWORKS[this.network]
      this.thor = new ThorClient({
        network: this.network === 'testnet' ? TESTNET_NETWORK : MAINNET_NETWORK,
        node: networkConfig.rpcUrl,
      })
      
      console.log(`VeChain ${this.network} provider initialized`)
    } catch (error) {
      console.error('Failed to initialize VeChain provider:', error)
      throw error
    }
  }

  // Get Thor instance
  getThor() {
    if (!this.thor) {
      throw new Error('VeChain provider not initialized')
    }
    return this.thor
  }

  // Get current network
  getNetwork(): VeChainNetwork {
    return this.network
  }

  // Get network configuration
  getNetworkConfig() {
    return VECHAIN_NETWORKS[this.network]
  }

  // Check if wallet is connected
  async isWalletConnected(): Promise<boolean> {
    try {
      // For now, return false as wallet connection is handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      return this.isConnected
    } catch (error) {
      console.error('Error checking wallet connection:', error)
      return false
    }
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    try {
      // Wallet connection is handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('Wallet connection should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Get current account
  getCurrentAccount(): string | null {
    try {
      // Account management is handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      return null
    } catch (error) {
      console.error('Error getting current account:', error)
      return null
    }
  }

  // Sign transaction
  async signTransaction(tx: any): Promise<string> {
    try {
      if (!this.thor) {
        throw new Error('VeChain provider not initialized')
      }

      // Transaction signing is handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('Transaction signing should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to sign transaction:', error)
      throw error
    }
  }

  // Execute contract method
  async executeContractMethod(
    contractAddress: string,
    abi: any[],
    methodName: string,
    parameters: any[] = [],
    value: string = '0'
  ): Promise<any> {
    try {
      if (!this.thor) {
        throw new Error('VeChain provider not initialized')
      }

      // Contract execution is handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('Contract execution should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to execute contract method:', error)
      throw error
    }
  }

  // Call contract method (read-only)
  async callContractMethod(
    contractAddress: string,
    abi: any[],
    methodName: string,
    parameters: any[] = []
  ): Promise<any> {
    try {
      if (!this.thor) {
        throw new Error('VeChain provider not initialized')
      }

      // Contract calls are handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('Contract calls should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to call contract method:', error)
      throw error
    }
  }

  // Get balance
  async getBalance(address: string): Promise<string> {
    try {
      if (!this.thor) {
        throw new Error('VeChain provider not initialized')
      }

      // Balance queries are handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('Balance queries should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to get balance:', error)
      throw error
    }
  }

  // Get VTHO balance
  async getVTHOBalance(address: string): Promise<string> {
    try {
      if (!this.thor) {
        throw new Error('VeChain provider not initialized')
      }

      // VTHO balance queries are handled by VeChainKit
      // This method will be implemented when integrating with VeChainKit
      throw new Error('VTHO balance queries should be handled by VeChainKit')
    } catch (error) {
      console.error('Failed to get VTHO balance:', error)
      throw error
    }
  }

  // Listen to events
  on(eventName: string, callback: (...args: any[]) => void) {
    if (!this.thor) {
      throw new Error('VeChain provider not initialized')
    }

    // VeChain event listening implementation
    // This would need to be implemented based on specific requirements
    console.log('Event listener registered for:', eventName)
  }

  // Remove event listener
  off(eventName: string, callback: (...args: any[]) => void) {
    console.log('Event listener removed for:', eventName)
  }

  // Disconnect wallet
  disconnect() {
    this.isConnected = false
    console.log('Wallet disconnected')
  }

  // Switch network
  switchNetwork(network: VeChainNetwork) {
    this.network = network
    this.disconnect()
    this.initializeThor()
  }
}

// Global VeChain provider instance
let vechainProvider: VeChainProvider | null = null

// Get or create VeChain provider instance
export function getVeChainProvider(network: VeChainNetwork = 'testnet'): VeChainProvider {
  if (!vechainProvider || vechainProvider.getNetwork() !== network) {
    vechainProvider = new VeChainProvider(network)
  }
  return vechainProvider
}

// Utility functions for VeChain
export const VeChainUtils = {
  // Convert VET to Wei
  vetToWei: (vet: string): string => {
    return (parseFloat(vet) * Math.pow(10, 18)).toString()
  },

  // Convert Wei to VET
  weiToVet: (wei: string): string => {
    return (parseFloat(wei) / Math.pow(10, 18)).toString()
  },

  // Convert VTHO to smallest unit
  vthoToSmallest: (vtho: string): string => {
    return (parseFloat(vtho) * Math.pow(10, 18)).toString()
  },

  // Convert smallest unit to VTHO
  smallestToVtho: (smallest: string): string => {
    return (parseFloat(smallest) / Math.pow(10, 18)).toString()
  },

  // Format address
  formatAddress: (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  // Validate VeChain address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },

  // Get transaction URL
  getTransactionUrl: (txHash: string, network: VeChainNetwork = 'testnet'): string => {
    const explorer = VECHAIN_NETWORKS[network].blockExplorer
    return `${explorer}/transactions/${txHash}`
  },

  // Get address URL
  getAddressUrl: (address: string, network: VeChainNetwork = 'testnet'): string => {
    const explorer = VECHAIN_NETWORKS[network].blockExplorer
    return `${explorer}/accounts/${address}`
  }
}
