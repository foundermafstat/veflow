import type { Node, NodeProps } from "@xyflow/react"

export type NodeType = "start" | "message" | "textInput" | "condition" | "domainTrigger" | "timerTrigger" | "notification" | "email" | "action" | "redirect"

// We need to ensure all node data types are assignable to Record<string, unknown>
export interface BaseNodeData extends Record<string, unknown> {
  label?: string
  title?: string
}

export interface StartNodeData extends BaseNodeData {
  message: string
}

export interface MessageNodeData extends BaseNodeData {
  message: string
  delay?: number
}

export interface TextInputNodeData extends BaseNodeData {
  message: string
  placeholder?: string
  variableName: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export interface ConditionNodeData extends BaseNodeData {
  condition: string
  trueLabel?: string
  falseLabel?: string
}

export interface DomainTriggerNodeData extends BaseNodeData {
  eventType: string
  domainPattern?: string
}

export interface TimerTriggerNodeData extends BaseNodeData {
  interval: number
  intervalUnit: 'minutes' | 'hours' | 'days'
}

export interface NotificationNodeData extends BaseNodeData {
  message: string
  notificationType: string
}

export interface EmailNodeData extends BaseNodeData {
  subject: string
  body: string
  recipients?: string[]
}

export interface ActionNodeData extends BaseNodeData {
  actionType: string
  parameters: Record<string, any>
}

export interface RedirectNodeData extends BaseNodeData {
  targetNodeId: string
}

export type NodeData = StartNodeData | MessageNodeData | TextInputNodeData | 
  ConditionNodeData | DomainTriggerNodeData | TimerTriggerNodeData | 
  NotificationNodeData | EmailNodeData | ActionNodeData | RedirectNodeData

// Correctly define CustomNode to work with ReactFlow
export interface CustomNode extends Omit<Node, 'data' | 'type'> {
  type: NodeType
  data: NodeData
}

// Define component prop types using partial NodeProps
export type CustomNodeProps<T extends NodeData> = {
  id: string;
  data: T;
  selected?: boolean;
}

export type StartNodeProps = CustomNodeProps<StartNodeData>;
export type MessageNodeProps = CustomNodeProps<MessageNodeData>;
export type TextInputNodeProps = CustomNodeProps<TextInputNodeData>;
export type ConditionNodeProps = CustomNodeProps<ConditionNodeData>;
export type DomainTriggerNodeProps = CustomNodeProps<DomainTriggerNodeData>;
export type TimerTriggerNodeProps = CustomNodeProps<TimerTriggerNodeData>;
export type NotificationNodeProps = CustomNodeProps<NotificationNodeData>;
export type EmailNodeProps = CustomNodeProps<EmailNodeData>;
export type ActionNodeProps = CustomNodeProps<ActionNodeData>;
export type RedirectNodeProps = CustomNodeProps<RedirectNodeData>;
