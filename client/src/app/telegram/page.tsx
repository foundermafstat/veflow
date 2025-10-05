'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Bot, MessageCircle, RefreshCw, Settings, Users, Webhook } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchTelegramStats, fetchTelegramBlueprints } from '@/app/api/telegram'
import { TelegramStats, TelegramBlueprint } from '@/types/telegram.types'

export default function TelegramPage() {
  const [stats, setStats] = useState<TelegramStats | null>(null)
  const [blueprints, setBlueprints] = useState<TelegramBlueprint[]>([])
  const [loading, setLoading] = useState(true)
  const [botToken, setBotToken] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [statsData, blueprintsData] = await Promise.all([
          fetchTelegramStats(),
          fetchTelegramBlueprints()
        ])
        
        setStats(statsData)
        setBlueprints(blueprintsData.blueprints)
        
        // В реальном приложении эти значения должны приходить из API
        setBotToken(localStorage.getItem('telegramBotToken') || '')
        setWebhookUrl(localStorage.getItem('telegramWebhookUrl') || '')
      } catch (error) {
        console.error('Error fetching Telegram data:', error)
        toast.error('Failed to load Telegram data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [toast])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // В реальном приложении здесь был бы запрос к API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация запроса
      
      // Сохраняем настройки локально для демонстрации
      localStorage.setItem('telegramBotToken', botToken)
      localStorage.setItem('telegramWebhookUrl', webhookUrl)
      
      toast.success('Telegram bot settings updated')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReloadStats = async () => {
    setLoading(true)
    try {
      const [statsData, blueprintsData] = await Promise.all([
        fetchTelegramStats(),
        fetchTelegramBlueprints()
      ])
      
      setStats(statsData)
      setBlueprints(blueprintsData.blueprints)
      toast.success('Telegram data refreshed')
    } catch (error) {
      toast.error('Failed to refresh Telegram data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            Telegram Integration
          </h1>
          <p className="text-muted-foreground">
            Configure and manage your Telegram bot for domain notifications
          </p>
        </div>
        <Button variant="outline" onClick={handleReloadStats} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commands">Bot Commands</TabsTrigger>
          <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.userCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active Telegram users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Watchlists</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.watchlistCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Domains being watched
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flows</CardTitle>
                <Flow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.flowStats ? Object.values(stats.flowStats).reduce((a, b) => a + b, 0) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active Telegram flows
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalNotifications || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Sent this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions from Telegram users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity?.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 rounded-md border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        @{activity.username} 
                        <span className="text-muted-foreground"> · {formatActionType(activity.action)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.entityType}</Badge>
                  </div>
                ))}

                {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent activity found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Bot Commands</CardTitle>
              <CardDescription>Commands users can send to your Telegram bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/start</h3>
                    <Badge variant="secondary">System</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Start interacting with the bot and display welcome message</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/help</h3>
                    <Badge variant="secondary">System</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Show available commands and help information</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/watch &lt;domain&gt; &lt;days&gt;</h3>
                    <Badge variant="default">Domain</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Add domain to watchlist with notification days before expiration</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/watchlist</h3>
                    <Badge variant="default">Domain</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Show your domain watchlist</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/flow</h3>
                    <Badge variant="purple">Flow</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Manage flows (list, create, delete)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blueprints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Telegram Blueprints</CardTitle>
              <CardDescription>Pre-configured templates for Telegram flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {blueprints.map(blueprint => (
                  <div key={blueprint.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{blueprint.name}</h3>
                      <Badge variant={getBlueprintBadgeVariant(blueprint.type)}>{blueprint.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{blueprint.description}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-muted-foreground">
                        {blueprint.nodes.length} nodes • {blueprint.edges.length} connections
                      </div>
                      <Button size="sm" variant="outline">Use Blueprint</Button>
                    </div>
                  </div>
                ))}
                
                {blueprints.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground col-span-2">
                    No blueprints available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure your Telegram bot API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botToken">Telegram Bot Token</Label>
                <Input
                  id="botToken"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="Enter your Telegram bot token from @BotFather"
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  Create a new bot with @BotFather on Telegram to get a token
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/api/telegram/webhook"
                />
                <p className="text-xs text-muted-foreground">
                  URL where Telegram will send updates to your bot
                </p>
              </div>
              
              <div className="pt-2">
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Manage webhook and bot state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Set Webhook</h3>
                  <p className="text-sm text-muted-foreground">
                    Register your webhook URL with Telegram
                  </p>
                </div>
                <Button variant="secondary">
                  <Webhook className="mr-2 h-4 w-4" />
                  Set Webhook
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Test Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your bot is properly connected
                  </p>
                </div>
                <Button variant="outline">
                  <Bot className="mr-2 h-4 w-4" />
                  Test Bot
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-destructive">Reset Bot</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all bot settings and data
                  </p>
                </div>
                <Button variant="destructive">
                  <Settings className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Вспомогательные функции
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

function formatActionType(action: string): string {
  switch (action) {
    case 'watch_domain':
      return 'watched a domain'
    case 'create_flow':
      return 'created a flow'
    case 'domain_notification':
      return 'received notification'
    default:
      return action.replace(/_/g, ' ')
  }
}

function getBlueprintBadgeVariant(type: string): "default" | "destructive" | "secondary" {
  switch (type) {
    case 'domain_expiration':
      return 'default'
    case 'domain_burn':
      return 'destructive'
    case 'telegram_command':
      return 'secondary' // Changed from 'blue' to 'secondary'
    default:
      return 'secondary'
  }
}

// Эти компоненты отсутствуют в вашем коде, поэтому я добавляю их здесь
const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const Flow = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 3a2 2 0 0 0-2 2" />
    <path d="M19 3a2 2 0 0 1 2 2" />
    <path d="M21 19a2 2 0 0 1-2 2" />
    <path d="M5 21a2 2 0 0 1-2-2" />
    <path d="M9 3h1" />
    <path d="M9 21h1" />
    <path d="M14 3h1" />
    <path d="M14 21h1" />
    <path d="M3 9v1" />
    <path d="M21 9v1" />
    <path d="M3 14v1" />
    <path d="M21 14v1" />
    <path d="m7 8-4 4 4 4" />
    <path d="m17 8 4 4-4 4" />
    <path d="m8 7 4-4 4 4" />
    <path d="m8 17 4 4 4-4" />
  </svg>
)
