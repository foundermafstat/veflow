"use client"

import { memo, useEffect, useState } from "react"
import {
  ReactFlow,
  type FitViewOptions,
  type DefaultEdgeOptions,
  Background,
  useReactFlow,
  Panel,
  Node,
  NodeTypes as ReactFlowNodeTypes
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTheme } from "next-themes"
import type { CustomNode, NodeData } from "@/types/node.types"

import { useFlowStore } from "@/contexts/flow-context"
import StartNode from "@/components/flow/nodes/start-node"
import MessageNode from "@/components/flow/nodes/message-node"
import TextInputNode from "@/components/flow/nodes/text-input-node"
import ConditionNode from "@/components/flow/nodes/condition-node"
import NotificationNode from "@/components/flow/nodes/notification-node"
import ActionNode from "@/components/flow/nodes/action-node"
import TelegramCommandNode from "@/components/flow/nodes/telegram-command-node"
import { useCanvasPanning } from "@/hooks/use-canvas-panning"
import { useNodeDragDrop } from "@/hooks/use-node-drag-drop"

// Define custom node types outside component to prevent re-renders
// Use type assertion to avoid TypeScript errors with component types
const nodeTypes: ReactFlowNodeTypes = {
  start: StartNode as any,
  message: MessageNode as any,
  textInput: TextInputNode as any,
  condition: ConditionNode as any,
  notification: NotificationNode as any,
  action: ActionNode as any,
  domainTrigger: StartNode as any, // Using StartNode as a base for domain triggers for now
  timerTrigger: StartNode as any,  // Using StartNode as a base for timer triggers for now
  email: NotificationNode as any,  // Email notifications use the same component with different props
  redirect: ActionNode as any,      // Redirects use the action node with different props
  command: TelegramCommandNode as any, // Telegram command node
}

// Static configurations outside component to prevent recreating on each render
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  type: "smoothstep",
}

const proOptions = {
  hideAttribution: true,
}

// Memoized Flow component to prevent unnecessary re-renders
const Flow = memo(function Flow() {
  // Direct store subscriptions for better performance
  // Cast to any to avoid TypeScript errors with Node types
  const nodes = useFlowStore((state) => state.nodes) as any
  const edges = useFlowStore((state) => state.edges)
  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange)
  const onConnect = useFlowStore((state) => state.onConnect)

  const { panOnDrag, isMiddlePanning, delta } = useCanvasPanning()
  const { onDragOver, onDrop } = useNodeDragDrop()
  const reactFlowInstance = useReactFlow()

  // Apply manual panning for middle mouse
  useEffect(() => {
    if (isMiddlePanning && (delta.x !== 0 || delta.y !== 0)) {
      const current = reactFlowInstance.getViewport()
      reactFlowInstance.setViewport({
        x: current.x + delta.x,
        y: current.y + delta.y,
        zoom: current.zoom,
      })
    }
  }, [delta, isMiddlePanning, reactFlowInstance])

  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only apply theme on the client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Get current theme values
  const currentTheme = mounted ? (resolvedTheme || theme) : 'light'
  const themeClass = mounted ? (currentTheme === 'dark' ? 'react-flow-dark-theme' : 'react-flow-light-theme') : 'react-flow-light-theme'
  const bgColor = currentTheme === 'dark' ? 'hsl(222.2, 84%, 4.9%)' : 'hsl(0, 0%, 100%)'
  
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={panOnDrag} // enables space + left mouse pan
        selectionOnDrag={!panOnDrag}
        selectNodesOnDrag={!isMiddlePanning}
        nodesDraggable={!panOnDrag && !isMiddlePanning}
        defaultEdgeOptions={defaultEdgeOptions}
        fitViewOptions={fitViewOptions}
        proOptions={proOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={themeClass}
      >
        <Background gap={16} color={bgColor} />
      </ReactFlow>
    </div>
  )
})

export default Flow
