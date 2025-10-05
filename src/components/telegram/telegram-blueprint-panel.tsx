"use client"

import React, { useEffect, useState } from 'react'
import { fetchTelegramBlueprints } from '@/api/telegram'
import { TelegramBlueprint } from '@/types/telegram.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFlowStore } from '@/contexts/flow-context'
import { useToast } from '@/hooks/use-toast'
import type { CustomNode } from '@/types/node.types'

export function TelegramBlueprintPanel() {
  const [blueprints, setBlueprints] = useState<TelegramBlueprint[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const addNode = useFlowStore((state) => state.addNode)

  useEffect(() => {
    const loadBlueprints = async () => {
      try {
        setLoading(true)
        const data = await fetchTelegramBlueprints()
        setBlueprints(data.blueprints)
        setStats(data.stats)
        setLoading(false)
      } catch (err) {
        setError('Failed to load Telegram blueprints')
        setLoading(false)
        console.error('Error loading blueprints:', err)
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
          // В зависимости от типа ноды добавляем необходимые свойства
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

      // Используем toast.success вместо toast({})
      toast.success(`Successfully imported ${blueprint.name}`)
    } catch (err) {
      // Используем toast.error вместо toast({})
      toast.error('Could not import blueprint')
      console.error('Error importing blueprint:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse">Loading Telegram blueprints...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
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
    <div className="space-y-4 p-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Telegram Blueprints</h2>
        <p className="text-sm text-muted-foreground">
          Import flow blueprints from Telegram bot
        </p>
      </div>

      {stats && (
        <Card className="mb-4 bg-blue-50 dark:bg-blue-950">
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

      <div className="space-y-3">
        {blueprints.map((blueprint) => (
          <Card key={blueprint.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">{blueprint.name}</CardTitle>
              <CardDescription>{blueprint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  {blueprint.type}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => importBlueprint(blueprint)}
                  className="text-xs"
                >
                  Import Blueprint
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {blueprints.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No Telegram blueprints available
          </div>
        )}
      </div>
    </div>
  )
}
