"use client"

import React, { useState, useEffect } from 'react'
import { useBlueprints } from '@/hooks/use-blueprints'
import CreateFlowDialog from './CreateFlowDialog'
import { useToast } from '@/components/ui/toast-notification'
import { useVeChain } from '@/hooks/use-vechain'
import { WalletStatus } from '@/components/vechain/WalletConnect'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Eye, 
  Check, 
  Zap, 
  Clock, 
  Database,
  Globe,
  Shield,
  Settings,
  Bot,
  FileText,
  Workflow
} from "lucide-react"
import { BlueprintWithMetadata, BlueprintPanelProps } from '@/types/blueprint.types'

// Mock data for blueprints - в реальном приложении будет загружаться из API
const mockBlueprints: BlueprintWithMetadata[] = [
  {
    id: 1,
    author: "0x1234...5678",
    metadataURI: "ipfs://QmBlueprint1",
    version: 1,
    active: true,
    createdAt: Date.now() - 86400000,
    metadata: {
      name: "HTTP Request",
      description: "Отправляет HTTP запрос к внешнему API",
      category: "web",
      tags: ["api", "http", "request"],
      inputs: [
        { name: "url", type: "string", required: true, description: "URL для запроса" },
        { name: "method", type: "string", required: false, defaultValue: "GET", description: "HTTP метод" }
      ],
      outputs: [
        { name: "response", type: "string", description: "Ответ от сервера" },
        { name: "status", type: "number", description: "HTTP статус код" }
      ],
      icon: "Globe",
      color: "blue",
      complexity: "simple",
      estimatedGas: 50000
    }
  },
  {
    id: 2,
    author: "0x1234...5678",
    metadataURI: "ipfs://QmBlueprint2",
    version: 1,
    active: true,
    createdAt: Date.now() - 172800000,
    metadata: {
      name: "Database Query",
      description: "Выполняет запрос к базе данных",
      category: "database",
      tags: ["database", "sql", "query"],
      inputs: [
        { name: "query", type: "string", required: true, description: "SQL запрос" },
        { name: "connection", type: "string", required: true, description: "Строка подключения" }
      ],
      outputs: [
        { name: "result", type: "string", description: "Результат запроса" }
      ],
      icon: "Database",
      color: "green",
      complexity: "medium",
      estimatedGas: 100000
    }
  },
  {
    id: 3,
    author: "0x1234...5678",
    metadataURI: "ipfs://QmBlueprint3",
    version: 1,
    active: true,
    createdAt: Date.now() - 259200000,
    metadata: {
      name: "Smart Contract Call",
      description: "Вызывает функцию смартконтракта",
      category: "blockchain",
      tags: ["smart-contract", "blockchain", "call"],
      inputs: [
        { name: "contractAddress", type: "address", required: true, description: "Адрес контракта" },
        { name: "functionName", type: "string", required: true, description: "Название функции" },
        { name: "parameters", type: "string", required: false, description: "Параметры функции" }
      ],
      outputs: [
        { name: "result", type: "bytes", description: "Результат вызова" }
      ],
      icon: "Shield",
      color: "purple",
      complexity: "complex",
      estimatedGas: 200000
    }
  },
  {
    id: 4,
    author: "0x1234...5678",
    metadataURI: "ipfs://QmBlueprint4",
    version: 1,
    active: true,
    createdAt: Date.now() - 345600000,
    metadata: {
      name: "Telegram Bot Message",
      description: "Отправляет сообщение через Telegram бота",
      category: "messaging",
      tags: ["telegram", "bot", "message"],
      inputs: [
        { name: "chatId", type: "string", required: true, description: "ID чата" },
        { name: "message", type: "string", required: true, description: "Текст сообщения" }
      ],
      outputs: [
        { name: "messageId", type: "number", description: "ID отправленного сообщения" }
      ],
      icon: "Bot",
      color: "cyan",
      complexity: "simple",
      estimatedGas: 30000
    }
  },
  {
    id: 5,
    author: "0x1234...5678",
    metadataURI: "ipfs://QmBlueprint5",
    version: 1,
    active: true,
    createdAt: Date.now() - 432000000,
    metadata: {
      name: "File Processing",
      description: "Обрабатывает загруженные файлы",
      category: "file",
      tags: ["file", "processing", "upload"],
      inputs: [
        { name: "filePath", type: "string", required: true, description: "Путь к файлу" },
        { name: "operation", type: "string", required: true, description: "Тип операции" }
      ],
      outputs: [
        { name: "processedPath", type: "string", description: "Путь к обработанному файлу" }
      ],
      icon: "FileText",
      color: "orange",
      complexity: "medium",
      estimatedGas: 80000
    }
  }
]

const categoryIcons = {
  web: Globe,
  database: Database,
  blockchain: Shield,
  messaging: Bot,
  file: FileText,
  automation: Workflow,
  analytics: Settings
}

const complexityColors = {
  simple: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  complex: "bg-red-100 text-red-800 border-red-200"
}

const complexityLabels = {
  simple: "Простой",
  medium: "Средний", 
  complex: "Сложный"
}

export default function BlueprintPanel({ onBlueprintSelect, onBlueprintCreate, selectedBlueprintId }: BlueprintPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [createFlowDialogOpen, setCreateFlowDialogOpen] = useState(false)
  
  // Use the blueprints hook
  const { 
    blueprints, 
    loading, 
    error, 
    selectBlueprint, 
    deselectBlueprint,
    selectedBlueprintIds,
    selectedBlueprints,
    refreshBlueprints 
  } = useBlueprints()
  
  const { info, error: showError } = useToast()

  // Группируем блупринты по категориям
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, BlueprintWithMetadata[]>()
    
    blueprints.forEach(blueprint => {
      const category = blueprint.metadata.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(blueprint)
    })
    
    return Array.from(categoryMap.entries()).map(([id, blueprints]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      blueprints
    }))
  }, [blueprints])

  // Фильтруем блупринты
  const filteredBlueprints = React.useMemo(() => {
    let filtered = blueprints

    if (searchTerm) {
      filtered = filtered.filter(blueprint =>
        blueprint.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(blueprint => blueprint.metadata.category === selectedCategory)
    }

    return filtered
  }, [blueprints, searchTerm, selectedCategory])

  const handleBlueprintSelect = (blueprint: BlueprintWithMetadata) => {
    selectBlueprint(blueprint)
    onBlueprintSelect(blueprint)
    info("Блупринт выбран", blueprint.metadata.name)
  }

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Блупринты</h3>
          {selectedBlueprints.length > 0 && (
            <Badge variant="secondary">
              {selectedBlueprints.length} выбрано
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {selectedBlueprints.length > 0 && (
            <Button 
              onClick={() => setCreateFlowDialogOpen(true)} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Создать флоу
            </Button>
          )}
          <Button onClick={onBlueprintCreate} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Создать
          </Button>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="p-4 border-b">
        <WalletStatus />
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск блупринтов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="database">База данных</TabsTrigger>
            <TabsTrigger value="blockchain">Блокчейн</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Blueprints List */}
      <ScrollArea className="flex-1 p-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Загрузка блупринтов...</div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="text-destructive text-sm">{error}</div>
            <Button variant="outline" size="sm" onClick={refreshBlueprints}>
              Попробовать снова
            </Button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-3">
            {filteredBlueprints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || selectedCategory !== "all" 
                  ? "Блупринты не найдены" 
                  : "Блупринты не загружены"
                }
              </div>
            ) : (
              filteredBlueprints.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  isSelected={selectedBlueprintId === blueprint.id || selectedBlueprintIds.includes(blueprint.id)}
                  onSelect={() => handleBlueprintSelect(blueprint)}
                  onPreview={() => {
                    // TODO: Implement preview functionality
                    console.log("Preview blueprint:", blueprint.id)
                  }}
                />
              ))
            )}
          </div>
        )}
      </ScrollArea>

      {/* Create Flow Dialog */}
      <CreateFlowDialog
        open={createFlowDialogOpen}
        onOpenChange={setCreateFlowDialogOpen}
        onFlowCreated={(flowId, txHash) => {
          console.log(`Flow created: ID ${flowId}, TX ${txHash}`)
          // TODO: Navigate to the created flow
        }}
      />
    </div>
  )
}

function BlueprintCard({ blueprint, isSelected, onSelect, onPreview }: {
  blueprint: BlueprintWithMetadata
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}) {
  const IconComponent = categoryIcons[blueprint.metadata.category as keyof typeof categoryIcons] || Settings

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${blueprint.metadata.color || 'gray'}-100`}>
              <IconComponent className={`w-5 h-5 text-${blueprint.metadata.color || 'gray'}-600`} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{blueprint.metadata.name}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">{blueprint.metadata.description}</p>
            </div>
          </div>
          {isSelected && (
            <Check className="w-5 h-5 text-blue-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${complexityColors[blueprint.metadata.complexity]}`}
            >
              {complexityLabels[blueprint.metadata.complexity]}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              v{blueprint.version}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
            className="h-6 px-2 text-xs"
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>
        
        {blueprint.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {blueprint.metadata.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            {blueprint.metadata.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{blueprint.metadata.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {blueprint.metadata.estimatedGas && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Zap className="w-3 h-3" />
            <span>~{blueprint.metadata.estimatedGas.toLocaleString()} gas</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
