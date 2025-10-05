"use client"

import type React from "react"

import { memo, useState } from "react"
import {
  MessageSquare,
  Play,
  Type,
  Filter,
  Clock,
  Bell,
  Mail,
  Globe,
  Code,
  ArrowRight,
  Bot,
  Hash,
  ListFilter,
  ChevronRight,
  ChevronDown,
  Users,
  Edit3,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { NodeType } from "@/types/node.types"

interface NodeTypeItem {
  type: NodeType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badge?: string
  badgeColor?: string
}

interface NodeCategory {
  id: string
  name: string
  description: string
  nodes: NodeTypeItem[]
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// Organize nodes into categories for better visual organization
const nodeCategories: NodeCategory[] = [
  // Core Interaction Nodes
  {
    id: "core",
    name: "Core",
    description: "Basic building blocks for conversations",
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    nodes: [
      {
        type: "start",
        label: "Start",
        description: "Begin the conversation",
        icon: Play,
        color: "text-green-600 dark:text-green-400",
        badge: "Required",
        badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      },
      {
        type: "message",
        label: "Message",
        description: "Send a message to the user",
        icon: MessageSquare,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        type: "textInput",
        label: "Text Input",
        description: "Collect text input from user",
        icon: Type,
        color: "text-purple-600 dark:text-purple-400",
      },
    ]
  },
  
  // Logic & Flow Control
  {
    id: "logic",
    name: "Logic",
    description: "Control the flow of your conversation",
    icon: Filter,
    color: "text-amber-600 dark:text-amber-400",
    nodes: [
      {
        type: "condition",
        label: "Condition",
        description: "Add a conditional branch to your flow",
        icon: Filter,
        color: "text-amber-600 dark:text-amber-400",
      },
      {
        type: "redirect",
        label: "Redirect",
        description: "Redirect flow to another branch",
        icon: ArrowRight,
        color: "text-violet-600 dark:text-violet-400",
      }
    ]
  },
  
  // Domain Nodes
  {
    id: "domain",
    name: "Domain Events",
    description: "React to domain lifecycle events",
    icon: Globe,
    color: "text-cyan-600 dark:text-cyan-400",
    nodes: [
      {
        type: "domainTrigger",
        label: "Domain Trigger",
        description: "React to domain lifecycle events",
        icon: Globe,
        color: "text-cyan-600 dark:text-cyan-400",
        badge: "Web3",
        badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      },
      {
        type: "timerTrigger",
        label: "Timer",
        description: "Schedule actions with a timer",
        icon: Clock,
        color: "text-orange-600 dark:text-orange-400",
      },
    ]
  },
  
  // Telegram Bot
  {
    id: "telegram",
    name: "Telegram",
    description: "Telegram bot integration nodes",
    icon: Bot,
    color: "text-indigo-600 dark:text-indigo-400",
    nodes: [
      {
        type: "notification",
        label: "Notification",
        description: "Send a notification to Telegram",
        icon: Bell,
        color: "text-indigo-600 dark:text-indigo-400",
      },
      {
        type: "command",
        label: "Command Handler",
        description: "Handle Telegram bot commands",
        icon: Hash,
        color: "text-indigo-600 dark:text-indigo-400",
        badge: "Bot",
        badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      },
    ]
  },
  
  // Other Notifications
  {
    id: "notifications",
    name: "Notifications",
    description: "Send messages to different channels",
    icon: Bell,
    color: "text-rose-600 dark:text-rose-400",
    nodes: [
      {
        type: "email",
        label: "Email",
        description: "Send an email notification",
        icon: Mail,
        color: "text-rose-600 dark:text-rose-400",
      },
    ]
  },
  
  // Actions
  {
    id: "actions",
    name: "Actions",
    description: "Execute actions on-chain or off-chain",
    icon: Code,
    color: "text-emerald-600 dark:text-emerald-400",
    nodes: [
      {
        type: "action",
        label: "Action",
        description: "Execute an on-chain action",
        icon: Code,
        color: "text-emerald-600 dark:text-emerald-400",
        badge: "On-chain",
        badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      },
    ]
  },
]

const AvailableNodesPanel = memo(function AvailableNodesPanel() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => 
    Object.fromEntries(nodeCategories.map(cat => [cat.id, true]))
  );

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // Extract all node types into a single flat array for search functionality if needed
  const allNodeTypes = nodeCategories.flatMap(category => category.nodes)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">Drag nodes onto the canvas to add them to your flow</div>
      </div>

      {nodeCategories.map((category) => (
        <div key={category.id} className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full p-2 justify-between group hover:bg-muted/50"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center space-x-2">
              <category.icon className={cn("size-4 shrink-0", category.color)} />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <div>
              {expandedCategories[category.id] ? 
                <ChevronDown className="size-4 text-muted-foreground"/> : 
                <ChevronRight className="size-4 text-muted-foreground"/>}
            </div>
          </Button>

          {expandedCategories[category.id] && (
            <div className="pl-2 space-y-1 mt-1">
              {category.nodes.map((nodeType) => {
                const Icon = nodeType.icon

                return (
                  <Button
                    key={nodeType.type}
                    variant="outline"
                    className="w-full h-auto p-2 justify-start cursor-grab active:cursor-grabbing bg-transparent border-dashed hover:border-solid group relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeType.type)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className={cn("flex items-center justify-center p-2 rounded-md bg-muted/50 group-hover:opacity-90", nodeType.color.includes('text-') ? nodeType.color.replace('text-', 'bg-').replace('600', '100').replace('400', '800') : '')}>
                        <Icon className={cn("size-4 shrink-0", nodeType.color)} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">{nodeType.label}</div>
                          {nodeType.badge && (
                            <Badge variant="outline" className={cn("text-[0.6rem] font-normal", nodeType.badgeColor)}>
                              {nodeType.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{nodeType.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
})

export default AvailableNodesPanel
