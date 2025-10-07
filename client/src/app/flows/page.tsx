'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import FlowCard from '@/components/flows/flow-card'
import { fetchAllFlows } from '@/actions/flow-actions'
import NewFlowDialog from '@/components/flows/new-flow-dialog'
import { getMockFlows, type MockFlow } from '@/data/mock-flows'

export default function FlowsPage() {
  const [flows, setFlows] = useState<MockFlow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newFlowDialogOpen, setNewFlowDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadFlows = async () => {
    try {
      setLoading(true)
      // Используем моковые данные для демонстрации
      const mockData = getMockFlows()
      setFlows(mockData)
      setLoading(false)
      
      // Попытка загрузить реальные данные в фоне
      try {
        const realData = await fetchAllFlows()
        if (realData && realData.length > 0) {
          setFlows(realData)
        }
      } catch (err) {
        console.log('Using mock data as fallback')
      }
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

  const handleFlowCreated = (newFlow: MockFlow) => {
    setFlows((prevFlows) => [...prevFlows, newFlow])
    toast.success('Flow created successfully')
  }

  const handleFlowDeleted = (flowId: string) => {
    setFlows((prevFlows) => prevFlows.filter((flow) => flow.id !== flowId))
    toast.success('Flow deleted successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 ">
          <div className="space-y-2 pt-24">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              VeChain Flows
            </h1>
            <p className="text-lg text-muted-foreground">
              Create and manage your VeChain automation workflows for DeFi, NFTs, and blockchain operations
            </p>
            {/* Statistics */}
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {flows.filter(f => f.isActive).length} Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {flows.filter(f => f.category === 'vechain').length} VeChain
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  {flows.reduce((sum, f) => sum + f.executionCount, 0)} Total Executions
                </span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setNewFlowDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Flow
          </Button>
        </div>

      {loading ? (
        <div className="flex justify-center items-center ">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
            </div>
            <p className="text-muted-foreground text-lg">Loading flows...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 p-8 rounded-xl text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Flows</h3>
          <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
          <Button 
            variant="outline" 
            onClick={loadFlows} 
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            Try Again
          </Button>
        </div>
      ) : flows.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No flows yet</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first flow to start automating your domain monitoring and unlock the power of VeFlow
          </p>
          <Button 
            onClick={() => setNewFlowDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Flow
          </Button>
        </div>
      ) : (
        <div className="flows-grid">
          {flows.map((flow, index) => (
            <div 
              key={flow.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FlowCard 
                flow={flow} 
                onDelete={handleFlowDeleted} 
              />
            </div>
          ))}
        </div>
      )}

      <NewFlowDialog
        open={newFlowDialogOpen}
        onOpenChange={setNewFlowDialogOpen}
        onCreate={handleFlowCreated}
      />
      </div>
    </div>
  )
}
