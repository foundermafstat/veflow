'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import SmartContractBlueprints from '@/components/flow/SmartContractBlueprints'
// Removed VeChain dependencies to prevent network errors
// import { useVeFlowContract } from '@/hooks/use-veflow-contract'
// import { useBlueprintMetadata } from '@/hooks/use-blueprint-metadata'
import { 
  Code, 
  Database, 
  Globe, 
  Zap,
  ExternalLink,
  Github
} from "lucide-react"
import Link from 'next/link'

export default function SmartContractBlueprintsPage() {
  // Simplified version without VeChain dependencies
  const blueprints = []
  const loading = false
  const error = null
  const isConnected = false

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
                Блупринты из смарт-контракта VeFlowRegistry
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
                    <p className="text-2xl font-bold">{blueprints.length}</p>
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
                    <Badge variant={isConnected ? "default" : "secondary"} className="mt-1">
                      {isConnected ? "Подключено" : "Демо режим"}
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
        <SmartContractBlueprints />

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
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
