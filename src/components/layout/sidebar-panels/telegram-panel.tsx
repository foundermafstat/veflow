"use client"

import React, { useEffect, useState } from 'react'
import { fetchTelegramBlueprints } from '@/app/api/telegram'
import { executeFlow } from '@/app/api/flows'
import { TelegramBlueprint } from '@/types/telegram.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFlowStore } from '@/contexts/flow-context'
import { useToast } from '@/hooks/use-toast'
import type { CustomNode } from '@/types/node.types'
import { Skeleton } from '@/components/ui/skeleton'
import { FlowExecutionControls } from '@/components/flow/flow-execution-controls'

export function TelegramPanel() {
  const [blueprints, setBlueprints] = useState<TelegramBlueprint[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [executingFlowId, setExecutingFlowId] = useState<string | null>(null)
  const { toast } = useToast()
  const addNode = useFlowStore((state) => state.addNode)
  const flowId = useFlowStore((state) => state.flowId)
  const userId = 'current-user-id' // TODO: Replace with actual user authentication

  // Mock data is now handled in the API layer

  useEffect(() => {
    const loadBlueprints = async () => {
      try {
        setLoading(true)
        // The API function now handles errors and returns mock data if needed
        const data = await fetchTelegramBlueprints()
        setBlueprints(data.blueprints)
        setStats(data.stats)
        setLoading(false)
      } catch (err) {
        // This should almost never happen now
        setError('Failed to load Telegram blueprints')
        setLoading(false)
        console.error('Critical error loading blueprints:', err)
      }
    }

    loadBlueprints()
  }, [])

  const importBlueprint = (blueprint: TelegramBlueprint) => {
    try {
      // Import nodes and edges from the blueprint
      blueprint.nodes.forEach(node => {
        // Create a compatible node data object based on the type
        let nodeData: any = {};
        
        // Copy properties from the original data
        if (node.data) {
          nodeData = { ...node.data };
          
          // Add required default properties based on node type to satisfy TypeScript
          if (node.data.type === 'text_input') {
            nodeData.message = nodeData.message || 'Enter text';
            nodeData.variableName = nodeData.variableName || 'input';
          }
        }
        
        const newNode: CustomNode = {
          id: `${node.id}-${Date.now()}`, // Ensure unique ID
          type: node.type as any,
          position: node.position,
          data: nodeData,
          selected: false,
          dragging: false
        };
        
        addNode(newNode);
      })

      toast.success(`Successfully imported ${blueprint.name}`)
    } catch (err) {
      toast.error('Could not import blueprint')
      console.error('Error importing blueprint:', err)
    }
  }
  
  // Execute blueprint directly via Telegram API
  const executeBlueprint = async (blueprint: TelegramBlueprint) => {
    try {
      setExecutingFlowId(blueprint.id)
      
      toast.info(`Starting ${blueprint.name} execution...`)
      
      // Create a triggerData object based on the blueprint type
      const triggerData = {
        type: blueprint.type,
        source: 'telegram_panel',
        timestamp: new Date().toISOString(),
        blueprint: blueprint.id,
        testMode: true
      }
      
      // Execute flow using the flows API
      const result = await executeFlow(blueprint.id, userId, triggerData)
      
      toast.success(`${blueprint.name} was executed successfully`)
      
      console.log('Flow execution result:', result)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred")
      console.error('Error executing blueprint:', err)
    } finally {
      setExecutingFlowId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Import flow blueprints from Telegram bot to quickly create predefined workflows.
      </p>

      {stats && (
        <Card className="mb-4 bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Telegram Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Users: <span className="font-semibold">{stats.userCount}</span></div>
              <div>Flows: <span className="font-semibold">{stats.flowCount}</span></div>
              <div>Watchlists: <span className="font-semibold">{stats.watchlistCount}</span></div>
              <div>Notifications: <span className="font-semibold">{stats.totalNotifications || 0}</span></div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {flowId && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Flow</CardTitle>
            <CardDescription>Execute and monitor your current flow</CardDescription>
          </CardHeader>
          <CardContent>
            <FlowExecutionControls 
              flowId={flowId} 
              userId={userId} 
              isActive={true} 
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {blueprints.map((blueprint) => (
          <Card key={blueprint.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">{blueprint.name}</CardTitle>
              <CardDescription>{blueprint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  {blueprint.type}
                </div>
                <div className="space-x-2 flex">
                  <Button 
                    size="sm" 
                    onClick={() => importBlueprint(blueprint)}
                  >
                    Import Blueprint
                  </Button>
                  <Button 
                    size="sm"
                    variant="secondary"
                    onClick={() => executeBlueprint(blueprint)}
                    disabled={executingFlowId === blueprint.id}
                  >
                    Execute
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {blueprints.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No Telegram blueprints available
          </div>
        )}
      </div>
    </div>
  )
}

export default TelegramPanel
