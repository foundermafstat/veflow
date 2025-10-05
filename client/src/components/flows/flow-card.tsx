'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { CalendarClock, Edit, Play, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { deleteFlow, toggleFlowActive } from '@/actions/flow-actions'
import { formatDistanceToNow } from 'date-fns'

interface FlowCardProps {
  flow: {
    id: string
    name: string
    description?: string
    triggerType: string
    isActive: boolean
    executionCount: number
    lastExecuted?: string
    createdAt: string
    updatedAt: string
  }
  onDelete: (flowId: string) => void
}

export default function FlowCard({ flow, onDelete }: FlowCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEditClick = () => {
    router.push(`/flow/${flow.id}`)
  }

  const handleRunClick = () => {
    router.push(`/flow/${flow.id}?execute=true`)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await deleteFlow(flow.id)
      onDelete(flow.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error('Failed to delete flow')
      console.error('Error deleting flow:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      setIsToggling(true)
      await toggleFlowActive(flow.id, !flow.isActive)
      // We don't update the state directly here because we'll refresh the data
      toast.success(flow.isActive ? 'Flow deactivated' : 'Flow activated')
    } catch (error) {
      toast.error('Failed to update flow status')
      console.error('Error updating flow status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const getTriggerTypeLabel = (type: string) => {
    switch (type) {
      case 'domain_expiration':
        return 'Domain Expiration'
      case 'domain_burn':
        return 'Domain Burn'
      case 'composite':
        return 'Composite Trigger'
      default:
        return type
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-bold text-lg">{flow.name}</CardTitle>
              <CardDescription>{flow.description || 'No description'}</CardDescription>
            </div>
            <Badge variant={flow.isActive ? 'default' : 'outline'}>
              {flow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Trigger Type:</span>
              <Badge variant="secondary">{getTriggerTypeLabel(flow.triggerType)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Executions:</span>
              <span className="font-medium">{flow.executionCount}</span>
            </div>
            {flow.lastExecuted && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Run:</span>
                <div className="flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  <span className="text-sm">{formatDistanceToNow(new Date(flow.lastExecuted), { addSuffix: true })}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Switch 
              checked={flow.isActive}
              disabled={isToggling} 
              onCheckedChange={handleToggleActive} 
            />
            <span className="text-sm">
              {isToggling ? 'Updating...' : flow.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleRunClick}>
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the flow &quot;{flow.name}&quot; and all of its execution history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
