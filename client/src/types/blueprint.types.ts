// Blueprint types based on VeFlow smart contracts

export interface Blueprint {
  id: number
  author: string
  metadataURI: string
  version: number
  active: boolean
  createdAt: number
}

export interface BlueprintMetadata {
  name: string
  description: string
  category: string
  tags: string[]
  inputs: BlueprintInput[]
  outputs: BlueprintOutput[]
  icon?: string
  color?: string
  complexity: 'simple' | 'medium' | 'complex'
  estimatedGas?: number
}

export interface BlueprintInput {
  name: string
  type: 'string' | 'number' | 'boolean' | 'address' | 'bytes'
  required: boolean
  description?: string
  defaultValue?: any
}

export interface BlueprintOutput {
  name: string
  type: 'string' | 'number' | 'boolean' | 'address' | 'bytes'
  description?: string
}

export interface FlowExecution {
  flowId: number
  blueprintIds: number[]
  executor: string
  inputData: string
  currentStep: number
  completed: boolean
  createdAt: number
  totalSteps: number
}

export interface BlueprintWithMetadata extends Blueprint {
  metadata: BlueprintMetadata
}

export interface BlueprintCategory {
  id: string
  name: string
  description: string
  icon: string
  blueprints: BlueprintWithMetadata[]
}

// Blueprint panel types
export interface BlueprintPanelProps {
  onBlueprintSelect: (blueprint: BlueprintWithMetadata) => void
  onBlueprintCreate: () => void
  selectedBlueprintId?: number
}

export interface BlueprintCardProps {
  blueprint: BlueprintWithMetadata
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}

// Blueprint creation/editing types
export interface CreateBlueprintData {
  name: string
  description: string
  category: string
  tags: string[]
  inputs: BlueprintInput[]
  outputs: BlueprintOutput[]
  complexity: 'simple' | 'medium' | 'complex'
  metadataURI: string
}

// Flow creation with blueprints
export interface CreateFlowData {
  name: string
  description?: string
  blueprintIds: number[]
  triggerType?: string
}

export interface FlowWithBlueprints {
  id: number
  name: string
  description?: string
  blueprints: BlueprintWithMetadata[]
  isActive: boolean
  createdAt: number
  executionCount: number
}
