"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"
import { Bell, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import MessageEditor from "@/components/flow/nodes/properties/shared/message-editor"

interface NotificationNodeProps {
  id: string;
  data: {
    message?: string;
    notificationType?: string;
    title?: string;
    [key: string]: any;
  };
  selected?: boolean;
}

const NotificationNode = memo(function NotificationNode({ id, data, selected }: NotificationNodeProps) {
  const { message, notificationType = "telegram", title = "Notification" } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const Icon = notificationType === 'telegram' ? Bot : Bell
  const nodeTitle = title || "Notification"
  
  // Color scheme based on notification type
  const colors = {
    telegram: {
      border: "border-indigo-200 dark:border-indigo-800",
      bg: "bg-indigo-50 dark:bg-indigo-950",
      header: "border-indigo-200 dark:border-indigo-800",
      icon: "text-indigo-600 dark:text-indigo-400",
      title: "text-indigo-800 dark:text-indigo-200",
      content: "border-indigo-200 dark:border-indigo-800",
      messageBox: "bg-indigo-100 dark:bg-indigo-900",
      badgeBg: "bg-indigo-100 dark:bg-indigo-900",
      badgeText: "text-indigo-800 dark:text-indigo-200",
    },
    email: {
      border: "border-rose-200 dark:border-rose-800",
      bg: "bg-rose-50 dark:bg-rose-950",
      header: "border-rose-200 dark:border-rose-800",
      icon: "text-rose-600 dark:text-rose-400",
      title: "text-rose-800 dark:text-rose-200",
      content: "border-rose-200 dark:border-rose-800",
      messageBox: "bg-rose-100 dark:bg-rose-900",
      badgeBg: "bg-rose-100 dark:bg-rose-900",
      badgeText: "text-rose-800 dark:text-rose-200",
    },
    default: {
      border: "border-blue-200 dark:border-blue-800",
      bg: "bg-blue-50 dark:bg-blue-950",
      header: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-800 dark:text-blue-200",
      content: "border-blue-200 dark:border-blue-800",
      messageBox: "bg-blue-100 dark:bg-blue-900",
      badgeBg: "bg-blue-100 dark:bg-blue-900",
      badgeText: "text-blue-800 dark:text-blue-200",
    }
  }

  const colorSet = colors[notificationType as keyof typeof colors] || colors.default

  const handleDoubleClick = () => {
    setActiveSidebarPanel("node-properties")
  }

  return (
    <NodeStatusIndicator status={isActiveInSimulation ? "loading" : "initial"} variant="border">
      <BaseNode
        className={`w-[300px] ${colorSet.border} ${colorSet.bg}`}
        data-selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <BaseNodeHeader className={colorSet.header}>
          <Icon className={`size-4 ${colorSet.icon}`} />
          <BaseNodeHeaderTitle className={colorSet.title}>{nodeTitle}</BaseNodeHeaderTitle>
          <Badge variant="outline" className={`${colorSet.badgeBg} ${colorSet.badgeText} border-none`}>
            {notificationType}
          </Badge>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className={`py-2 text-muted-foreground border-b border-dashed ${colorSet.content}`}>
              <span className="font-medium text-sm">Message:</span>
              <div
                className={cn(
                  "py-1 px-2 rounded mt-1",
                  message ? colorSet.messageBox : "bg-destructive/10",
                )}
              >
                {message ? (
                  <MessageEditor value={message} readOnly className="font-medium" />
                ) : (
                  <span className="text-destructive">Message is required</span>
                )}
              </div>
            </div>
          </div>
        </BaseNodeContent>

        {/* Input handle on left, output handle on right */}
        <BaseHandle type="target" position={Position.Left} />
        <BaseHandle type="source" position={Position.Right} />
      </BaseNode>
    </NodeStatusIndicator>
  )
})

export default NotificationNode
