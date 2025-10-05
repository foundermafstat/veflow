"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"
import { Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import MessageEditor from "@/components/flow/nodes/properties/shared/message-editor"

interface TelegramCommandNodeProps {
  id: string;
  data: {
    message?: string;
    command?: string;
    title?: string;
    [key: string]: any;
  };
  selected?: boolean;
}

const TelegramCommandNode = memo(function TelegramCommandNode({ id, data, selected }: TelegramCommandNodeProps) {
  const { message, command = "start", title = "Telegram Command" } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const handleDoubleClick = () => {
    setActiveSidebarPanel("node-properties")
  }

  return (
    <NodeStatusIndicator status={isActiveInSimulation ? "loading" : "initial"} variant="border">
      <BaseNode
        className="w-[300px] border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950"
        data-selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <BaseNodeHeader className="border-indigo-200 dark:border-indigo-800">
          <Hash className="size-4 text-indigo-600 dark:text-indigo-400" />
          <BaseNodeHeaderTitle className="text-indigo-800 dark:text-indigo-200">{title}</BaseNodeHeaderTitle>
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-none">
            /{command}
          </Badge>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className="py-2 text-muted-foreground border-b border-dashed border-indigo-200 dark:border-indigo-800">
              <span className="font-medium text-sm">Command Format:</span>
              <div
                className={cn(
                  "py-1 px-2 rounded mt-1",
                  message ? "bg-indigo-100 dark:bg-indigo-900" : "bg-destructive/10",
                )}
              >
                {message ? (
                  <MessageEditor value={message} readOnly className="font-medium" />
                ) : (
                  <span className="text-destructive">Command description is required</span>
                )}
              </div>
            </div>
          </div>
        </BaseNodeContent>

        {/* Only output handle for command nodes */}
        <BaseHandle type="source" position={Position.Right} />
      </BaseNode>
    </NodeStatusIndicator>
  )
})

export default TelegramCommandNode
