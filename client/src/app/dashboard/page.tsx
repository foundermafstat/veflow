'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Clock, Eye, Activity, LayoutGrid, MessageSquareText, Plus } from 'lucide-react'
import { fetchAllFlows } from '@/actions/flow-actions'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const [flows, setFlows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFlows: 0,
    activeFlows: 0,
    totalExecutions: 0,
    successRate: 0,
    domains: {
      watched: 0,
      expiring: 0,
      opportunities: 0
    }
  })
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Загрузить данные о флоу
        const flowsData = await fetchAllFlows()
        setFlows(flowsData)
        
        // Рассчитать статистику
        const activeFlows = flowsData.filter((flow: any) => flow.isActive).length
        const totalExecutions = flowsData.reduce((sum: number, flow: any) => sum + (flow.executionCount || 0), 0)
        
        setStats({
          totalFlows: flowsData.length,
          activeFlows,
          totalExecutions,
          successRate: 95, // Моковые данные, в реальном API нужно получать из бэкенда
          domains: {
            watched: 24, // Моковые данные
            expiring: 3,
            opportunities: 7
          }
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast.error('Failed to load dashboard data')
        setLoading(false)
      }
    }
    
    loadData()
  }, [toast])

  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Doma Automation dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFlows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeFlows} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flow Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successRate}% success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watched Domains</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.domains.watched}</div>
            <p className="text-xs text-muted-foreground">
              {stats.domains.expiring} expiring soon
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.domains.opportunities}</div>
            <p className="text-xs text-muted-foreground">
              New domain opportunities
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="flows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flows">Recent Flows</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flows" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flows.slice(0, 6).map((flow: any) => (
              <Card key={flow.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{flow.name}</CardTitle>
                  <CardDescription className="truncate">
                    {flow.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>
                        {flow.executionCount || 0} executions
                      </span>
                    </div>
                    <div className={flow.isActive ? 'text-green-500' : 'text-muted-foreground'}>
                      {flow.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/flow/${flow.id}`}>
                      Open Flow
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full p-3 bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium tracking-tight">Create New Flow</h3>
                  <p className="text-sm text-muted-foreground">
                    Build custom flows for domain monitoring and automation
                  </p>
                </div>
                <Button asChild>
                  <Link href="/flows">
                    Create Flow
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/flows">
                View all flows
                <span className="sr-only">(View all flows)</span>
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest actions and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Flow executed</p>
                  <p className="text-xs text-muted-foreground">
                    "Domain Expiration Alert" executed successfully
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">5m ago</div>
              </div>
              
              <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Domain added to watchlist</p>
                  <p className="text-xs text-muted-foreground">
                    "example.eth" added to your watchlist
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">1h ago</div>
              </div>
              
              <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <MessageSquareText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Telegram notification</p>
                  <p className="text-xs text-muted-foreground">
                    Notification sent about domain opportunity
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">3h ago</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View all activities</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Stay updated on domain events and opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-md border p-4 bg-yellow-50 dark:bg-yellow-950/20">
                <div className="rounded-full bg-yellow-500/20 p-2">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Domain expiring soon</p>
                  <p className="text-xs text-muted-foreground">
                    "premium.eth" expires in 5 days
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="rounded-full bg-green-500/20 p-2">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New domain opportunity</p>
                  <p className="text-xs text-muted-foreground">
                    "invest.eth" is available for registration
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View all notifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
