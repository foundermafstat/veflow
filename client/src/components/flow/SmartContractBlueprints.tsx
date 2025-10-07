"use client"

import React from 'react'
// Temporarily disabled VeChain dependencies to prevent network errors
// import { useVeFlowContract } from '@/hooks/use-veflow-contract'
// import { useBlueprintMetadata } from '@/hooks/use-blueprint-metadata'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Code, 
  Coins, 
  Battery, 
  Eye, 
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface SmartContractBlueprintsProps {
  onBlueprintSelect?: (blueprint: any) => void
}

const iconMap = {
  'coins': Coins,
  'battery': Battery,
  'eye': Eye,
  'settings': Code
}

const colorMap = {
  'green': 'bg-green-100 text-green-800 border-green-200',
  'blue': 'bg-blue-100 text-blue-800 border-blue-200',
  'purple': 'bg-purple-100 text-purple-800 border-purple-200'
}

const complexityMap = {
  'simple': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'complex': 'bg-red-100 text-red-800'
}

export default function SmartContractBlueprints({ onBlueprintSelect }: SmartContractBlueprintsProps) {
  // Simplified version with mock data to prevent network errors
  const blueprints: any[] = []
  const loading = false
  const error = null
  const isConnected = false
  const [blueprintsWithMetadata, setBlueprintsWithMetadata] = React.useState<any[]>([])
  const [metadataLoading, setMetadataLoading] = React.useState(false)
  const { toast } = useToast()

  // Simplified metadata loading - no network calls
  React.useEffect(() => {
    setBlueprintsWithMetadata([])
    setMetadataLoading(false)
  }, [])

  const handleBlueprintSelect = (blueprint: any) => {
    if (onBlueprintSelect) {
      onBlueprintSelect(blueprint)
    }
    toast.success(`Выбран блупринт: ${blueprint.metadata.name}`)
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Code
    return <IconComponent className="w-5 h-5" />
  }

  if (loading || metadataLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Блупринты из смарт-контракта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Загрузка блупринтов...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Блупринты из смарт-контракта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Ошибка: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Блупринты из смарт-контракта
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Подключено" : "Демо режим"}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {blueprintsWithMetadata.length} блупринтов загружено из VeFlowRegistry
        </p>
      </CardHeader>
      <CardContent>
        {blueprintsWithMetadata.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Блупринты не найдены</p>
            <p className="text-sm">Подключите кошелек для загрузки блупринтов из смарт-контракта</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {blueprintsWithMetadata.map((blueprint) => (
                <Card 
                  key={blueprint.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBlueprintSelect(blueprint)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorMap[blueprint.metadata.color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}`}>
                          {getIcon(blueprint.metadata.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {blueprint.metadata.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {blueprint.metadata.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${complexityMap[blueprint.metadata.complexity]}`}
                      >
                        {blueprint.metadata.complexity === 'simple' ? 'Простой' :
                         blueprint.metadata.complexity === 'medium' ? 'Средний' : 'Сложный'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        v{blueprint.version}
                      </Badge>
                      {blueprint.metadata.estimatedGas && (
                        <Badge variant="outline" className="text-xs">
                          ~{blueprint.metadata.estimatedGas.toLocaleString()} gas
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {blueprint.metadata.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p>Автор: {blueprint.author.slice(0, 6)}...{blueprint.author.slice(-4)}</p>
                      <p>Создан: {new Date(blueprint.createdAt * 1000).toLocaleDateString()}</p>
                      <p>Статус: {blueprint.active ? 'Активен' : 'Неактивен'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
