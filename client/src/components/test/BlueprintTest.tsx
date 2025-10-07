"use client"

import React from 'react'
import { useBlueprints } from '@/hooks/use-blueprints'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BlueprintTest() {
  const { 
    blueprints, 
    loading, 
    error, 
    refreshBlueprints 
  } = useBlueprints()

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Тест загрузки блупринтов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={refreshBlueprints} disabled={loading}>
              {loading ? 'Загрузка...' : 'Обновить блупринты'}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 p-3 bg-red-50 rounded">
              Ошибка: {error}
            </div>
          )}
          
          {loading && (
            <div className="text-blue-500">
              Загрузка блупринтов...
            </div>
          )}
          
          {!loading && !error && (
            <div className="space-y-2">
              <div className="font-semibold">
                Загружено блупринтов: {blueprints.length}
              </div>
              
              {blueprints.map((blueprint, index) => (
                <div key={`${blueprint.id}-${index}-${blueprint.author}`} className="p-3 border rounded">
                  <div className="font-medium">{blueprint.metadata.name}</div>
                  <div className="text-sm text-gray-600">{blueprint.metadata.description}</div>
                  <div className="text-xs text-gray-500">
                    Категория: {blueprint.metadata.category} | 
                    Сложность: {blueprint.metadata.complexity} |
                    ID: {blueprint.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
