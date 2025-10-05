"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import type { ConditionNodeProps } from "@/types/node.types"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { getNodeIcon } from "@/utils/node-utils"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"
import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ConditionNode = memo(function ConditionNode({ id, data, selected }: ConditionNodeProps) {
  const { condition = "true", title = "Condition", trueLabel = "true", falseLabel = "false" } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const Icon = Filter
  const nodeTitle = title || "Condition"

  const handleDoubleClick = () => {
    setActiveSidebarPanel("node-properties")
  }

  return (
    <NodeStatusIndicator status={isActiveInSimulation ? "loading" : "initial"} variant="border">
      <BaseNode
        className="w-[300px] border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
        data-selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <BaseNodeHeader className="border-amber-200 dark:border-amber-800">
          <Icon className="size-4 text-amber-600 dark:text-amber-400" />
          <BaseNodeHeaderTitle className="text-amber-800 dark:text-amber-200">{nodeTitle}</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className="py-2 text-muted-foreground border-b border-dashed border-amber-200 dark:border-amber-800">
              <span className="font-medium text-sm">Condition:</span>
              <div
                className={cn(
                  "py-1 px-2 rounded mt-1 font-mono text-xs bg-amber-100 dark:bg-amber-900/50",
                )}
              >
                {condition}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none">
                {trueLabel}
              </Badge>
              <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-none">
                {falseLabel}
              </Badge>
            </div>
          </div>
        </BaseNodeContent>

        {/* Input handle on left, two output handles on right (top = true, bottom = false) */}
        <BaseHandle type="target" position={Position.Left} />
        <BaseHandle type="source" position={Position.Right} id="true" style={{ top: "40%" }} />
        <BaseHandle type="source" position={Position.Right} id="false" style={{ top: "60%" }} />
      </BaseNode>
    </NodeStatusIndicator>
  )
})

export default ConditionNode
