"use client"

import { useState, useEffect } from 'react'

interface SafeWalletState {
  account: string | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export function useSafeVeChain(): SafeWalletState {
  const [state, setState] = useState<SafeWalletState>({
    account: null,
    isConnected: false,
    isLoading: false,
    error: null
  })

  useEffect(() => {
    // Simulate a safe wallet state for demo purposes
    // This prevents any network errors from VeChain wallet initialization
    setState({
      account: null,
      isConnected: false,
      isLoading: false,
      error: null
    })
  }, [])

  return state
}

