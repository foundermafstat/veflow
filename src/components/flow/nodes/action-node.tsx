"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"
import { Code, Globe, Server } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActionNodeProps {
  id: string;
  data: {
    actionType?: string;
    parameters?: Record<string, any>;
    title?: string;
    [key: string]: any;
  };
  selected?: boolean;
}

const ActionNode = memo(function ActionNode({ id, data, selected }: ActionNodeProps) {
  const { actionType = "custom", parameters = {}, title = "Action" } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  // Select icon based on action type
  const getIcon = () => {
    switch (actionType) {
      case 'domain_action':
      case 'add_watchlist':
      case 'remove_watchlist':
      case 'list_watchlist':
        return Globe
      case 'flow_action':
      case 'list':
      case 'create':
      case 'delete':
        return Server
      default:
        return Code
    }
  }

  const Icon = getIcon()
  const nodeTitle = title

  // Color scheme for emerald
  const colorSet = {
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    header: "border-emerald-200 dark:border-emerald-800",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-200",
    content: "border-emerald-200 dark:border-emerald-800",
    paramBox: "bg-emerald-100 dark:bg-emerald-900",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900",
    badgeText: "text-emerald-800 dark:text-emerald-200",
  }

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
            {actionType}
          </Badge>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className={`py-2 text-muted-foreground border-b border-dashed ${colorSet.content}`}>
              <span className="font-medium text-sm">Parameters:</span>
              
              {Object.keys(parameters).length > 0 ? (
                <div className={cn("py-1 px-2 rounded mt-1", colorSet.paramBox)}>
                  <pre className="text-xs font-mono overflow-auto max-h-20">
                    {JSON.stringify(parameters, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="py-1 px-2 rounded mt-1 bg-muted/20 text-xs italic">
                  No parameters
                </div>
              )}
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

export default ActionNode
