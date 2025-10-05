'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import FlowCard from '@/components/flows/flow-card'
import { fetchAllFlows } from '@/actions/flow-actions'
import NewFlowDialog from '@/components/flows/new-flow-dialog'

export default function FlowsPage() {
  const [flows, setFlows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newFlowDialogOpen, setNewFlowDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadFlows = async () => {
    try {
      setLoading(true)
      const data = await fetchAllFlows()
      setFlows(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load flows')
      setLoading(false)
      toast.error('Could not load flows. Please try again.')
      console.error('Error loading flows:', err)
    }
  }

  useEffect(() => {
    loadFlows()
  }, [])

  const handleFlowCreated = (newFlow) => {
    setFlows((prevFlows) => [...prevFlows, newFlow])
    toast.success('Flow created successfully')
  }

  const handleFlowDeleted = (flowId) => {
    setFlows((prevFlows) => prevFlows.filter((flow) => flow.id !== flowId))
    toast.success('Flow deleted successfully')
  }

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flows</h1>
          <p className="text-muted-foreground">
            Create and manage your automation workflows
          </p>
        </div>
        <Button onClick={() => setNewFlowDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Flow
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={loadFlows} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : flows.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No flows yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first flow to start automating your domain monitoring
          </p>
          <Button onClick={() => setNewFlowDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Flow
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => (
            <FlowCard 
              key={flow.id} 
              flow={flow} 
              onDelete={handleFlowDeleted} 
            />
          ))}
        </div>
      )}

      <NewFlowDialog
        open={newFlowDialogOpen}
        onOpenChange={setNewFlowDialogOpen}
        onCreate={handleFlowCreated}
      />
    </div>
  )
}
