"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  LogOut, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useVeChain } from '@/hooks/use-vechain'
import { VeChainNetwork } from '@/lib/vechain-provider'
import { useToast } from '@/components/ui/toast-notification'

interface WalletConnectProps {
  network?: VeChainNetwork
  onConnect?: () => void
  onDisconnect?: () => void
  showBalance?: boolean
  compact?: boolean
}

export default function WalletConnect({ 
  network = 'testnet',
  onConnect,
  onDisconnect,
  showBalance = true,
  compact = false
}: WalletConnectProps) {
  const { 
    isConnected, 
    account, 
    balance, 
    vthoBalance,
    connecting, 
    loadingBalance,
    connect, 
    disconnect, 
    refreshBalance,
    formatAddress,
    getTransactionUrl,
    getAddressUrl
  } = useVeChain(network)
  
  const { success } = useToast()

  const handleConnect = async () => {
    await connect()
    if (onConnect) {
      onConnect()
    }
  }

  const handleDisconnect = () => {
    disconnect()
    if (onDisconnect) {
      onDisconnect()
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      success('Адрес скопирован', formatAddress(account))
    }
  }

  const openExplorer = () => {
    if (account) {
      window.open(getAddressUrl(account), '_blank')
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button 
            size="sm" 
            onClick={handleConnect} 
            disabled={connecting}
            className="gap-2"
          >
            <Wallet className="w-4 h-4" />
            {connecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
    )
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect VeChain Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Connect your VeChain wallet to interact with VeFlow blueprints and create flows
          </div>
          
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
            <Badge variant="outline">
              {network === 'testnet' ? 'VeChain Testnet' : 'VeChain Mainnet'}
            </Badge>
          </div>

          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            className="w-full gap-2"
            size="lg"
          >
            <Wallet className="w-4 h-4" />
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            Make sure you have VeWorld or another VeChain wallet installed
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Wallet Connected
          </span>
          <Button variant="ghost" size="sm" onClick={handleDisconnect}>
            <LogOut className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Account Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={openExplorer}>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="p-2 bg-muted rounded text-sm font-mono">
            {formatAddress(account || '')}
          </div>
        </div>

        <Separator />

        {/* Network Info */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network</span>
          <Badge variant="outline">
            {network === 'testnet' ? 'VeChain Testnet' : 'VeChain Mainnet'}
          </Badge>
        </div>

        {/* Balance Info */}
        {showBalance && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={refreshBalance}
                  disabled={loadingBalance}
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>VET</span>
                  <span className="font-mono">{parseFloat(balance).toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>VTHO</span>
                  <span className="font-mono">{parseFloat(vthoBalance).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Connection Status */}
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700">Wallet connected successfully</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact wallet status component
export function WalletStatus({ network = 'testnet' }: { network?: VeChainNetwork }) {
  const { isConnected, account, balance, formatAddress } = useVeChain(network)
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span>Wallet not connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle className="w-4 h-4 text-green-500" />
      <span>{formatAddress(account || '')}</span>
      <Badge variant="secondary" className="text-xs">
        {parseFloat(balance).toFixed(2)} VET
      </Badge>
    </div>
  )
}
