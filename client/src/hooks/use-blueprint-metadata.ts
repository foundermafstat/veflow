"use client"

import { useState, useEffect, useCallback } from 'react'

interface BlueprintMetadata {
  name: string
  description: string
  category: string
  tags: string[]
  complexity: 'simple' | 'medium' | 'complex'
  estimatedGas?: number
  color?: string
  icon?: string
}

interface UseBlueprintMetadataReturn {
  getMetadata: (metadataURI: string) => Promise<BlueprintMetadata | null>
  loading: boolean
  error: string | null
}

export function useBlueprintMetadata(): UseBlueprintMetadataReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMetadata = useCallback(async (metadataURI: string): Promise<BlueprintMetadata | null> => {
    if (!metadataURI) {
      return null
    }

    try {
      setLoading(true)
      setError(null)

      // Handle different URI formats
      let url = metadataURI
      
      // If it's an IPFS hash, convert to HTTP gateway URL
      if (metadataURI.startsWith('ipfs://')) {
        const hash = metadataURI.replace('ipfs://', '')
        url = `https://ipfs.io/ipfs/${hash}`
      } else if (metadataURI.startsWith('Qm') || metadataURI.startsWith('baf')) {
        // Direct IPFS hash
        url = `https://ipfs.io/ipfs/${metadataURI}`
      } else if (!metadataURI.startsWith('http')) {
        // Assume it's a relative path or just a hash
        url = `https://ipfs.io/ipfs/${metadataURI}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`)
      }

      const metadata = await response.json()
      
      // Validate and provide defaults for required fields
      const validatedMetadata: BlueprintMetadata = {
        name: metadata.name || 'Unnamed Blueprint',
        description: metadata.description || 'No description available',
        category: metadata.category || 'smart-contract',
        tags: Array.isArray(metadata.tags) ? metadata.tags : ['smart-contract'],
        complexity: ['simple', 'medium', 'complex'].includes(metadata.complexity) 
          ? metadata.complexity 
          : 'medium',
        estimatedGas: metadata.estimatedGas || undefined,
        color: metadata.color || 'blue',
        icon: metadata.icon || 'settings'
      }

      return validatedMetadata
    } catch (err) {
      console.error('Error fetching blueprint metadata:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata')
      
      // Return mock metadata for demonstration
      const mockMetadataMap: Record<string, BlueprintMetadata> = {
        'QmMockHash1': {
          name: 'VeChain Token Transfer',
          description: 'Automatically transfer VET tokens when conditions are met',
          category: 'smart-contract',
          tags: ['vechain', 'token', 'transfer', 'automation'],
          complexity: 'simple',
          color: 'green',
          icon: 'coins',
          estimatedGas: 21000
        },
        'QmMockHash2': {
          name: 'VeChain Energy Management',
          description: 'Monitor and manage VTHO energy consumption',
          category: 'smart-contract',
          tags: ['vechain', 'energy', 'vtho', 'management'],
          complexity: 'medium',
          color: 'blue',
          icon: 'battery',
          estimatedGas: 45000
        },
        'QmMockHash3': {
          name: 'Smart Contract Event Monitor',
          description: 'Monitor specific smart contract events and trigger actions',
          category: 'smart-contract',
          tags: ['monitoring', 'events', 'smart-contract', 'automation'],
          complexity: 'complex',
          color: 'purple',
          icon: 'eye',
          estimatedGas: 80000
        }
      }

      return mockMetadataMap[metadataURI] || {
        name: 'Smart Contract Blueprint',
        description: 'Blueprint from VeFlow smart contract',
        category: 'smart-contract',
        tags: ['smart-contract', 'on-chain'],
        complexity: 'medium',
        color: 'blue',
        icon: 'settings'
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getMetadata,
    loading,
    error
  }
}
