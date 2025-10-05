"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Trash2, ArrowRight } from "lucide-react"
import { BlueprintWithMetadata, CreateFlowData } from '@/types/blueprint.types'
import { useBlueprints } from '@/hooks/use-blueprints'
import { useToast } from '@/components/ui/toast-notification'
import { useVeChain } from '@/hooks/use-vechain'
import { createBlueprintAPI, BlueprintAPIExtended } from '@/lib/blueprint-api'

interface CreateFlowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFlowCreated?: (flowId: number, txHash: string) => void
}

export default function CreateFlowDialog({ open, onOpenChange, onFlowCreated }: CreateFlowDialogProps) {
  const [flowName, setFlowName] = useState("")
  const [flowDescription, setFlowDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState("0")
  const [loadingCost, setLoadingCost] = useState(false)
  
  const { 
    selectedBlueprints, 
    selectedBlueprintIds, 
    createFlow, 
    clearSelection,
    deselectBlueprint 
  } = useBlueprints()
  
  const { success, error } = useToast()
  const { provider, isConnected, account } = useVeChain()
  
  // Create extended API instance
  const blueprintAPI = new BlueprintAPIExtended(provider)

  const handleCreateFlow = async () => {
    if (!flowName.trim()) {
      error("Ошибка", "Пожалуйста, введите название флоу")
      return
    }

    if (selectedBlueprintIds.length === 0) {
      error("Ошибка", "Пожалуйста, выберите хотя бы один блупринт")
      return
    }

    if (!isConnected) {
      error("Ошибка", "Подключите кошелек для создания флоу")
      return
    }

    try {
      setIsCreating(true)
      
      const flowData: CreateFlowData = {
        name: flowName.trim(),
        description: flowDescription.trim() || undefined,
        blueprintIds: selectedBlueprintIds
      }

      const result = await blueprintAPI.createFlow(flowData)
      
      // Reset form
      setFlowName("")
      setFlowDescription("")
      setEstimatedCost("0")
      
      // Close dialog
      onOpenChange(false)
      
      // Notify parent
      if (onFlowCreated) {
        onFlowCreated(result.flowId, result.txHash)
      }
      
      // Show success message
      success(
        "Флоу успешно создан!",
        `ID: ${result.flowId}`
      )
      
    } catch (err) {
      console.error("Error creating flow:", err)
      error(
        "Ошибка создания флоу",
        err instanceof Error ? err.message : "Попробуйте снова"
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleRemoveBlueprint = (blueprintId: number) => {
    deselectBlueprint(blueprintId)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Don't clear selection on close, let user keep it for next time
  }

  // Calculate estimated cost when blueprints change
  React.useEffect(() => {
    const calculateCost = async () => {
      if (selectedBlueprintIds.length === 0) {
        setEstimatedCost("0")
        return
      }

      try {
        setLoadingCost(true)
        const cost = await blueprintAPI.calculateFlowCost(selectedBlueprintIds)
        setEstimatedCost(cost)
      } catch (err) {
        console.error('Error calculating flow cost:', err)
        setEstimatedCost("0")
      } finally {
        setLoadingCost(false)
      }
    }

    calculateCost()
  }, [selectedBlueprintIds, blueprintAPI])

  const totalEstimatedGas = selectedBlueprints.reduce((total, blueprint) => {
    return total + (blueprint.metadata.estimatedGas || 0)
  }, 0)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Создать новый флоу</DialogTitle>
          <DialogDescription>
            Создайте новый флоу из выбранных блупринтов. Флоу будет выполнять блупринты в указанном порядке.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flow Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flowName">Название флоу *</Label>
              <Input
                id="flowName"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Введите название флоу"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flowDescription">Описание</Label>
              <Textarea
                id="flowDescription"
                value={flowDescription}
                onChange={(e) => setFlowDescription(e.target.value)}
                placeholder="Введите описание флоу (необязательно)"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Selected Blueprints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Выбранные блупринты</h3>
              <Badge variant="outline">
                {selectedBlueprints.length} блупринтов
              </Badge>
            </div>

            {selectedBlueprints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Блупринты не выбраны</p>
                <p className="text-sm">Выберите блупринты в панели блупринтов</p>
              </div>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-3">
                  {selectedBlueprints.map((blueprint, index) => (
                    <div key={blueprint.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{blueprint.metadata.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            v{blueprint.version}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              blueprint.metadata.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                              blueprint.metadata.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {blueprint.metadata.complexity === 'simple' ? 'Простой' :
                             blueprint.metadata.complexity === 'medium' ? 'Средний' : 'Сложный'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {blueprint.metadata.description}
                        </p>
                        {blueprint.metadata.estimatedGas && (
                          <p className="text-xs text-muted-foreground">
                            ~{blueprint.metadata.estimatedGas.toLocaleString()} gas
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {index < selectedBlueprints.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBlueprint(blueprint.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Flow Summary */}
          {selectedBlueprints.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Сводка флоу</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Количество шагов:</span>
                    <span className="ml-2 font-medium">{selectedBlueprints.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Примерный расход газа:</span>
                    <span className="ml-2 font-medium">{totalEstimatedGas.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Стоимость выполнения:</span>
                    <span className="ml-2 font-medium">
                      {loadingCost ? "Загрузка..." : `${estimatedCost} VET`}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => clearSelection()}
            disabled={selectedBlueprints.length === 0 || isCreating}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить выбор
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Отмена
          </Button>
          
          <Button
            onClick={handleCreateFlow}
            disabled={!flowName.trim() || selectedBlueprintIds.length === 0 || isCreating || !isConnected}
          >
            {isCreating ? "Создание..." : !isConnected ? "Подключите кошелек" : "Создать флоу"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
