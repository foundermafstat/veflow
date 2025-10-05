'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { createFlow } from '@/actions/flow-actions'

interface NewFlowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (flow: any) => void
}

export default function NewFlowDialog({ open, onOpenChange, onCreate }: NewFlowDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [triggerType, setTriggerType] = useState('domain_expiration')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!triggerType) {
      errors.triggerType = 'Trigger type is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      
      const newFlow = await createFlow({
        name,
        description,
        triggerType,
        // Создаем пустой шаблон flowJson
        flowJson: {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 }
        }
      })
      
      onCreate(newFlow)
      router.push(`/flow/${newFlow.id}`)
      
    } catch (error) {
      toast.error('Failed to create flow')
      console.error('Error creating flow:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Сбросить форму при закрытии
      setName('')
      setDescription('')
      setTriggerType('domain_expiration')
      setFormErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
          <DialogDescription>
            Create a new workflow to automate your domain management tasks
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Automation Flow"
              className={formErrors.name ? 'border-destructive' : ''}
            />
            {formErrors.name && (
              <p className="text-xs text-destructive">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this flow does..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerType">
              Trigger Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={triggerType}
              onValueChange={setTriggerType}
            >
              <SelectTrigger id="triggerType" className={formErrors.triggerType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domain_expiration">Domain Expiration</SelectItem>
                <SelectItem value="domain_burn">Domain Burn</SelectItem>
                <SelectItem value="composite">Composite Trigger</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.triggerType && (
              <p className="text-xs text-destructive">{formErrors.triggerType}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Edit'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
