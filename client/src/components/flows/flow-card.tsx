'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { CalendarClock, Edit, Play, Trash, Loader2, Coins, Zap, FileText, Vote, Server, TrendingUp, Image, Lock } from 'lucide-react'
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
    category?: string
    tags?: string[]
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
      case 'vechain_transfer':
        return 'VeChain Transfer'
      case 'vechain_energy':
        return 'VeChain Energy'
      case 'vechain_contract':
        return 'Smart Contract'
      case 'vechain_governance':
        return 'Governance'
      case 'vechain_node':
        return 'Node Health'
      case 'vechain_dex':
        return 'DEX Trading'
      case 'vechain_nft':
        return 'NFT Marketplace'
      case 'vechain_staking':
        return 'Staking'
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const getTriggerTypeIcon = (type: string) => {
    switch (type) {
      case 'vechain_transfer':
        return <Coins className="h-4 w-4" />
      case 'vechain_energy':
        return <Zap className="h-4 w-4" />
      case 'vechain_contract':
        return <FileText className="h-4 w-4" />
      case 'vechain_governance':
        return <Vote className="h-4 w-4" />
      case 'vechain_node':
        return <Server className="h-4 w-4" />
      case 'vechain_dex':
        return <TrendingUp className="h-4 w-4" />
      case 'vechain_nft':
        return <Image className="h-4 w-4" />
      case 'vechain_staking':
        return <Lock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <>
      <Card className="flow-card flow-card-gradient group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer" onClick={handleEditClick}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Status indicator */}
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full status-indicator ${
          flow.isActive ? 'active' : 'inactive'
        }`}></div>

        {/* Edit link overlay */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            Click to edit
          </div>
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {flow.name}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {flow.description || 'No description provided'}
              </CardDescription>
            </div>
            <Badge 
              variant={flow.isActive ? 'default' : 'outline'}
              className={`flow-badge ${
                flow.isActive 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/25' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
              } font-semibold px-3 py-1`}
            >
              {flow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4 relative z-10">
          <div className="space-y-4">
            {/* Trigger Type */}
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Trigger Type</span>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0 font-semibold flex items-center gap-1"
              >
                {getTriggerTypeIcon(flow.triggerType)}
                {getTriggerTypeLabel(flow.triggerType)}
              </Badge>
            </div>

            {/* Executions */}
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Executions</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-slate-900 dark:text-white text-lg">{flow.executionCount}</span>
              </div>
            </div>

            {/* Last Executed */}
            {flow.lastExecuted && (
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Last Run</span>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {formatDistanceToNow(new Date(flow.lastExecuted), { addSuffix: true })}
                  </span>
                </div>
              </div>
            )}

            {/* Tags */}
            {flow.tags && flow.tags.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {flow.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {flow.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                      +{flow.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-600 relative z-10">
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Switch 
              checked={flow.isActive}
              disabled={isToggling} 
              onCheckedChange={handleToggleActive}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {isToggling ? 'Updating...' : flow.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleRunClick}
              className="flow-button h-9 w-9 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group/btn"
            >
              <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleEditClick}
              className="flow-button h-9 w-9 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group/btn"
            >
              <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="flow-button h-9 w-9 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group/btn"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
          <AlertDialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Delete Flow?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              This will permanently delete the flow <span className="font-semibold text-slate-900 dark:text-white">&quot;{flow.name}&quot;</span> and all of its execution history.
              <br /><br />
              <span className="text-red-600 dark:text-red-400 font-medium">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 pt-6">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border-0 font-semibold py-3"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting} 
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete Flow'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
