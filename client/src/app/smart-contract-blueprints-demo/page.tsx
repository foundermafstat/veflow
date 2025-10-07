'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Code, 
  Database, 
  Globe, 
  Zap,
  ExternalLink,
  Coins,
  Battery,
  Eye,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from 'next/link'

// Mock data for demonstration
const mockBlueprints = [
  {
    id: 1,
    name: 'VeChain Token Transfer',
    description: 'Automatically transfer VET tokens when conditions are met',
    category: 'smart-contract',
    tags: ['vechain', 'token', 'transfer', 'automation'],
    complexity: 'simple',
    color: 'green',
    icon: 'coins',
    estimatedGas: 21000,
    version: 1,
    author: '0x1234...7890',
    createdAt: '2024-01-15',
    active: true
  },
  {
    id: 2,
    name: 'VeChain Energy Management',
    description: 'Monitor and manage VTHO energy consumption',
    category: 'smart-contract',
    tags: ['vechain', 'energy', 'vtho', 'management'],
    complexity: 'medium',
    color: 'blue',
    icon: 'battery',
    estimatedGas: 45000,
    version: 2,
    author: '0x2345...8901',
    createdAt: '2024-01-14',
    active: true
  },
  {
    id: 3,
    name: 'Smart Contract Event Monitor',
    description: 'Monitor specific smart contract events and trigger actions',
    category: 'smart-contract',
    tags: ['monitoring', 'events', 'smart-contract', 'automation'],
    complexity: 'complex',
    color: 'purple',
    icon: 'eye',
    estimatedGas: 80000,
    version: 1,
    author: '0x3456...9012',
    createdAt: '2024-01-13',
    active: true
  }
]

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

export default function SmartContractBlueprintsDemoPage() {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Code
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
              <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                Smart Contract Blueprints
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Блупринты из смарт-контракта VeFlowRegistry (Демо режим)
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Всего блупринтов</p>
                    <p className="text-2xl font-bold">{mockBlueprints.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Статус подключения</p>
                    <Badge variant="secondary" className="mt-1">
                      Демо режим
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Сеть</p>
                    <p className="text-sm font-medium">VeChain Testnet</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Контракт</p>
                    <p className="text-xs font-mono">VeFlowRegistry</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contract Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Информация о контракте
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">VeFlowRegistry</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Управляет регистрацией и версионированием блупринтов
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Адрес контракта:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      0xc03db9560d8be616748b1b158d5fb99094e33f41
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Сеть:</span>
                    <span>VeChain Testnet</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Block Explorer:</span>
                    <Link 
                      href="https://explore-testnet.vechain.org/accounts/0xc03db9560d8be616748b1b158d5fb99094e33f41"
                      target="_blank"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Открыть
                    </Link>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Функции контракта</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• registerBlueprint() - Регистрация нового блупринта</li>
                  <li>• updateBlueprint() - Обновление существующего блупринта</li>
                  <li>• getBlueprint() - Получение информации о блупринте</li>
                  <li>• getBlueprintCount() - Получение общего количества блупринтов</li>
                  <li>• getBlueprintsByAuthor() - Получение блупринтов автора</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blueprints List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Блупринты из смарт-контракта
              </div>
              <Badge variant="secondary">
                Демо режим
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {mockBlueprints.length} блупринтов загружено из VeFlowRegistry
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBlueprints.map((blueprint) => (
                <Card 
                  key={blueprint.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorMap[blueprint.color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}`}>
                          {getIcon(blueprint.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {blueprint.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {blueprint.description}
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
                        className={`text-xs ${complexityMap[blueprint.complexity as keyof typeof complexityMap]}`}
                      >
                        {blueprint.complexity === 'simple' ? 'Простой' :
                         blueprint.complexity === 'medium' ? 'Средний' : 'Сложный'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        v{blueprint.version}
                      </Badge>
                      {blueprint.estimatedGas && (
                        <Badge variant="outline" className="text-xs">
                          ~{blueprint.estimatedGas.toLocaleString()} gas
                        </Badge>
                      )}
                      {blueprint.active ? (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Активен
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Неактивен
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {blueprint.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Автор: {blueprint.author}</p>
                      <p>Создан: {blueprint.createdAt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/flows">
              <Code className="w-4 h-4 mr-2" />
              Создать Flow
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/flow/1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Flow Builder
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

