"use client"

import { useState, useEffect, useCallback } from 'react'
import { getVeChainProvider, VeChainNetwork, VeChainUtils } from '@/lib/vechain-provider'
import { useToast } from '@/hooks/use-toast'

interface UseVeChainReturn {
  // Provider state
  provider: any
  isConnected: boolean
  account: string | null
  network: VeChainNetwork
  
  // Account info
  balance: string
  vthoBalance: string
  
  // Loading states
  connecting: boolean
  loadingBalance: boolean
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (network: VeChainNetwork) => void
  refreshBalance: () => Promise<void>
  
  // Utility functions
  formatAddress: (address: string) => string
  getTransactionUrl: (txHash: string) => string
  getAddressUrl: (address: string) => string
}

export function useVeChain(network: VeChainNetwork = 'testnet'): UseVeChainReturn {
  const [provider] = useState(() => getVeChainProvider(network))
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState('0')
  const [vthoBalance, setVthoBalance] = useState('0')
  const [connecting, setConnecting] = useState(false)
  const [loadingBalance, setLoadingBalance] = useState(false)
  
  const { success, error: showError } = useToast()

  // Check connection status on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Refresh balance when account changes
  useEffect(() => {
    if (account) {
      refreshBalance()
    }
  }, [account])

  const checkConnection = useCallback(async () => {
    try {
      const connected = await provider.isWalletConnected()
      setIsConnected(connected)
      
      if (connected) {
        const currentAccount = provider.getCurrentAccount()
        setAccount(currentAccount)
      } else {
        setAccount(null)
        setBalance('0')
        setVthoBalance('0')
      }
    } catch (err) {
      console.error('Error checking connection:', err)
      setIsConnected(false)
      setAccount(null)
    }
  }, [provider])

  const connect = useCallback(async () => {
    try {
      setConnecting(true)
      
      const connectedAccount = await provider.connectWallet()
      setIsConnected(true)
      setAccount(connectedAccount)
      
      success('Кошелек подключен', `Адрес: ${VeChainUtils.formatAddress(connectedAccount)}`)
    } catch (err) {
      console.error('Error connecting wallet:', err)
      showError('Ошибка подключения', err instanceof Error ? err.message : 'Не удалось подключить кошелек')
    } finally {
      setConnecting(false)
    }
  }, [provider, success, showError])

  const disconnect = useCallback(() => {
    provider.disconnect()
    setIsConnected(false)
    setAccount(null)
    setBalance('0')
    setVthoBalance('0')
  }, [provider])

  const switchNetwork = useCallback((newNetwork: VeChainNetwork) => {
    provider.switchNetwork(newNetwork)
    disconnect()
  }, [provider, disconnect])

  const refreshBalance = useCallback(async () => {
    if (!account) return

    try {
      setLoadingBalance(true)
      
      const [vetBalance, vthoBal] = await Promise.all([
        provider.getBalance(account),
        provider.getVTHOBalance(account)
      ])
      
      setBalance(VeChainUtils.weiToVet(vetBalance))
      setVthoBalance(VeChainUtils.smallestToVtho(vthoBal))
    } catch (err) {
      console.error('Error refreshing balance:', err)
      showError('Ошибка загрузки баланса', 'Не удалось получить баланс кошелька')
    } finally {
      setLoadingBalance(false)
    }
  }, [account, provider, showError])

  const formatAddress = useCallback((address: string) => {
    return VeChainUtils.formatAddress(address)
  }, [])

  const getTransactionUrl = useCallback((txHash: string) => {
    return VeChainUtils.getTransactionUrl(txHash, network)
  }, [network])

  const getAddressUrl = useCallback((address: string) => {
    return VeChainUtils.getAddressUrl(address, network)
  }, [network])

  return {
    // Provider state
    provider,
    isConnected,
    account,
    network,
    
    // Account info
    balance,
    vthoBalance,
    
    // Loading states
    connecting,
    loadingBalance,
    
    // Actions
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
    
    // Utility functions
    formatAddress,
    getTransactionUrl,
    getAddressUrl
  }
}

// Hook for VeChain connection status only
export function useVeChainConnection(network: VeChainNetwork = 'testnet') {
  const { isConnected, account, connect, disconnect } = useVeChain(network)
  
  return {
    isConnected,
    account,
    connect,
    disconnect
  }
}

// Hook for VeChain balance only
export function useVeChainBalance(network: VeChainNetwork = 'testnet') {
  const { balance, vthoBalance, refreshBalance, loadingBalance } = useVeChain(network)
  
  return {
    balance,
    vthoBalance,
    refreshBalance,
    loadingBalance
  }
}
