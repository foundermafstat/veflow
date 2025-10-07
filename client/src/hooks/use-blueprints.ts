"use client"

import { useState, useEffect, useCallback } from 'react'
import { BlueprintWithMetadata, CreateFlowData } from '@/types/blueprint.types'
import { useBlueprintAPI } from '@/lib/blueprint-api'
import { VeChainNetwork } from '@/lib/vechain-provider'
import { useVeFlowContract } from './use-veflow-contract'
import { useBlueprintMetadata } from './use-blueprint-metadata'

interface UseBlueprintsReturn {
  blueprints: BlueprintWithMetadata[]
  loading: boolean
  error: string | null
  selectedBlueprints: BlueprintWithMetadata[]
  selectedBlueprintIds: number[]
  createFlow: (flowData: CreateFlowData) => Promise<{ flowId: number; txHash: string }>
  selectBlueprint: (blueprint: BlueprintWithMetadata) => void
  deselectBlueprint: (blueprintId: number) => void
  clearSelection: () => void
  refreshBlueprints: () => Promise<void>
}

export function useBlueprints(network: VeChainNetwork = 'testnet'): UseBlueprintsReturn {
  const [blueprints, setBlueprints] = useState<BlueprintWithMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlueprints, setSelectedBlueprints] = useState<BlueprintWithMetadata[]>([])
  const [selectedBlueprintIds, setSelectedBlueprintIds] = useState<number[]>([])

  const blueprintAPI = useBlueprintAPI(network)
  const veFlowContract = useVeFlowContract(network)
  const { getMetadata } = useBlueprintMetadata()

  // Load blueprints on mount
  useEffect(() => {
    loadBlueprints()
  }, [])

  const loadBlueprints = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load blueprints from API
      const apiBlueprints = await blueprintAPI.getAllBlueprints()
      
      // Load blueprints from smart contract
      const contractBlueprints: BlueprintWithMetadata[] = []
      if (veFlowContract.isConnected && veFlowContract.blueprints.length > 0) {
        for (const contractBlueprint of veFlowContract.blueprints) {
          try {
            const metadata = await getMetadata(contractBlueprint.metadataURI)
            if (metadata) {
              contractBlueprints.push({
                id: contractBlueprint.id,
                version: contractBlueprint.version,
                metadata: {
                  ...metadata,
                  author: contractBlueprint.author,
                  createdAt: new Date(contractBlueprint.createdAt * 1000).toISOString(),
                  updatedAt: new Date(contractBlueprint.createdAt * 1000).toISOString(),
                  active: contractBlueprint.active
                }
              })
            }
          } catch (err) {
            console.warn(`Failed to load metadata for blueprint ${contractBlueprint.id}:`, err)
            // Still add the blueprint with default metadata
            contractBlueprints.push({
              id: contractBlueprint.id,
              version: contractBlueprint.version,
              metadata: {
                name: `Smart Contract Blueprint #${contractBlueprint.id}`,
                description: 'Blueprint from VeFlow smart contract',
                category: 'smart-contract',
                tags: ['smart-contract', 'on-chain'],
                complexity: 'medium',
                color: 'blue',
                icon: 'settings',
                author: contractBlueprint.author,
                createdAt: new Date(contractBlueprint.createdAt * 1000).toISOString(),
                updatedAt: new Date(contractBlueprint.createdAt * 1000).toISOString(),
                active: contractBlueprint.active
              }
            })
          }
        }
      }
      
      // Combine API blueprints and smart contract blueprints
      const allBlueprints = [...apiBlueprints, ...contractBlueprints]
      setBlueprints(allBlueprints)
    } catch (err) {
      console.error('Error loading blueprints:', err)
      setError(err instanceof Error ? err.message : 'Failed to load blueprints')
    } finally {
      setLoading(false)
    }
  }, [blueprintAPI, veFlowContract, getMetadata])

  const selectBlueprint = useCallback((blueprint: BlueprintWithMetadata) => {
    setSelectedBlueprints(prev => {
      // Check if already selected
      if (prev.some(bp => bp.id === blueprint.id)) {
        return prev
      }
      return [...prev, blueprint]
    })
    
    setSelectedBlueprintIds(prev => {
      if (prev.includes(blueprint.id)) {
        return prev
      }
      return [...prev, blueprint.id]
    })
  }, [])

  const deselectBlueprint = useCallback((blueprintId: number) => {
    setSelectedBlueprints(prev => prev.filter(bp => bp.id !== blueprintId))
    setSelectedBlueprintIds(prev => prev.filter(id => id !== blueprintId))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedBlueprints([])
    setSelectedBlueprintIds([])
  }, [])

  const createFlow = useCallback(async (flowData: CreateFlowData) => {
    try {
      setError(null)
      const result = await blueprintAPI.createFlow(flowData)
      // Clear selection after successful creation
      clearSelection()
      return result
    } catch (err) {
      console.error('Error creating flow:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flow'
      setError(errorMessage)
      throw err
    }
  }, [blueprintAPI, clearSelection])

  const refreshBlueprints = useCallback(async () => {
    await loadBlueprints()
  }, [loadBlueprints])

  return {
    blueprints,
    loading,
    error,
    selectedBlueprints,
    selectedBlueprintIds,
    createFlow,
    selectBlueprint,
    deselectBlueprint,
    clearSelection,
    refreshBlueprints
  }
}

// Hook for managing a single blueprint selection
interface UseBlueprintSelectionReturn {
  selectedBlueprint: BlueprintWithMetadata | null
  selectBlueprint: (blueprint: BlueprintWithMetadata) => void
  clearSelection: () => void
}

export function useBlueprintSelection(): UseBlueprintSelectionReturn {
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintWithMetadata | null>(null)

  const selectBlueprint = useCallback((blueprint: BlueprintWithMetadata) => {
    setSelectedBlueprint(blueprint)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedBlueprint(null)
  }, [])

  return {
    selectedBlueprint,
    selectBlueprint,
    clearSelection
  }
}
