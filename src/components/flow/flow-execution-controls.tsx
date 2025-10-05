"use client"

import { useState } from 'react'
import { executeFlow, fetchFlowExecutions } from '@/api/flows'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Play, List, RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { type FlowExecution } from '@/types/flow.types'

interface FlowExecutionControlsProps {
  flowId: string
  userId: string
  isActive?: boolean
  onExecutionComplete?: (executionResult: any) => void
}

export function FlowExecutionControls({
  flowId,
  userId,
  isActive = true,
  onExecutionComplete,
}: FlowExecutionControlsProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false)
  const [executions, setExecutions] = useState<FlowExecution[]>([])
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(false)
  const { toast } = useToast()

  // Execute flow
  const handleExecuteFlow = async () => {
    if (!isActive) {
      toast.error("Flow is inactive. Activate the flow before executing it.")
      return
    }

    try {
      setIsExecuting(true)
      toast.info("The flow execution has started...")

      const result = await executeFlow(flowId, userId)
      
      toast.success("The flow was executed successfully.")
      
      if (onExecutionComplete) {
        onExecutionComplete(result)
      }
      
      // Refresh executions list if dialog is open
      if (executionDialogOpen) {
        loadExecutions()
      }
      
    } catch (error) {
      console.error('Error executing flow:', error)
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsExecuting(false)
    }
  }

  // Load execution history
  const loadExecutions = async () => {
    try {
      setIsLoadingExecutions(true)
      const result = await fetchFlowExecutions(flowId, userId)
      setExecutions(result.executions)
    } catch (error) {
      console.error('Error loading executions:', error)
      toast.error("Failed to load executions. Could not retrieve execution history")
    } finally {
      setIsLoadingExecutions(false)
    }
  }

  // Handle opening the executions dialog
  const handleOpenExecutionsDialog = () => {
    setExecutionDialogOpen(true)
    loadExecutions()
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleExecuteFlow}
        disabled={isExecuting || !isActive}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {isExecuting ? (
          <>
            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Run Flow
          </>
        )}
      </Button>

      <Dialog open={executionDialogOpen} onOpenChange={setExecutionDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenExecutionsDialog}
          >
            <List className="mr-2 h-4 w-4" />
            Executions
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Flow Execution History</DialogTitle>
          </DialogHeader>
          
          {isLoadingExecutions ? (
            <div className="flex justify-center my-8">
              <RotateCcw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !executions || executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No execution history available
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {executions.map((execution) => (
                  <div
                    key={execution.id}
                    className="border rounded-md p-4 bg-muted/30"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <ExecutionStatusBadge status={execution.status} />
                          <span className="ml-2 font-medium">
                            {new Date(execution.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        {execution.completedAt && (
                          <div className="text-xs text-muted-foreground">
                            Completed: {new Date(execution.completedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      {/* Expand button for future detailed view */}
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="font-semibold">Trigger:</div>
                      <pre className="overflow-auto text-xs p-2 bg-muted rounded-md mt-1 max-h-[100px]">
                        {JSON.stringify(execution.triggerData, null, 2)}
                      </pre>
                    </div>

                    {execution.error && (
                      <div className="mt-2 text-sm text-destructive">
                        <div className="font-semibold">Error:</div>
                        <div className="p-2 bg-destructive/10 rounded-md mt-1">
                          {execution.error}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={loadExecutions}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ExecutionStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" /> Completed
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertCircle className="w-3 h-3 mr-1" /> Failed
        </Badge>
      )
    case 'running':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <RotateCcw className="w-3 h-3 mr-1 animate-spin" /> Running
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      )
  }
}
