export interface MockFlow {
  id: string
  name: string
  description: string
  triggerType: string
  isActive: boolean
  executionCount: number
  lastExecuted?: string
  createdAt: string
  updatedAt: string
  category: 'vechain' | 'domain' | 'composite'
  tags: string[]
}

export const mockFlows: MockFlow[] = [
  {
    id: '1',
    name: 'VeChain Token Transfer Monitor',
    description: 'Monitors VET token transfers and sends notifications when large amounts are moved',
    triggerType: 'vechain_transfer',
    isActive: true,
    executionCount: 47,
    lastExecuted: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    category: 'vechain',
    tags: ['VET', 'transfers', 'monitoring', 'notifications']
  },
  {
    id: '2',
    name: 'VeChain Energy Management',
    description: 'Automatically manages VTHO energy consumption and refills when needed',
    triggerType: 'vechain_energy',
    isActive: true,
    executionCount: 23,
    lastExecuted: '2024-01-15T09:15:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    category: 'vechain',
    tags: ['VTHO', 'energy', 'automation', 'management']
  },
  {
    id: '3',
    name: 'VeChain Smart Contract Events',
    description: 'Tracks specific smart contract events and triggers actions based on contract state changes',
    triggerType: 'vechain_contract',
    isActive: false,
    executionCount: 12,
    lastExecuted: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    category: 'vechain',
    tags: ['smart-contracts', 'events', 'monitoring', 'automation']
  },
  {
    id: '4',
    name: 'VeChain Governance Voting',
    description: 'Automatically participates in VeChain governance voting based on predefined criteria',
    triggerType: 'vechain_governance',
    isActive: true,
    executionCount: 8,
    lastExecuted: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    category: 'vechain',
    tags: ['governance', 'voting', 'automation', 'delegation']
  },
  {
    id: '5',
    name: 'VeChain Node Health Monitor',
    description: 'Monitors VeChain node health and performance metrics, alerts on issues',
    triggerType: 'vechain_node',
    isActive: true,
    executionCount: 156,
    lastExecuted: '2024-01-15T11:00:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    category: 'vechain',
    tags: ['node', 'health', 'monitoring', 'alerts']
  },
  {
    id: '6',
    name: 'VeChain DEX Arbitrage',
    description: 'Monitors VeChain DEX prices and executes arbitrage opportunities automatically',
    triggerType: 'vechain_dex',
    isActive: false,
    executionCount: 3,
    lastExecuted: '2024-01-13T14:20:00Z',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
    category: 'vechain',
    tags: ['DEX', 'arbitrage', 'trading', 'automation']
  },
  {
    id: '7',
    name: 'VeChain NFT Marketplace Monitor',
    description: 'Tracks NFT sales and listings on VeChain marketplaces, notifies on price changes',
    triggerType: 'vechain_nft',
    isActive: true,
    executionCount: 89,
    lastExecuted: '2024-01-15T12:30:00Z',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
    category: 'vechain',
    tags: ['NFT', 'marketplace', 'monitoring', 'pricing']
  },
  {
    id: '8',
    name: 'VeChain Staking Rewards',
    description: 'Automatically claims staking rewards and reinvests them for compound growth',
    triggerType: 'vechain_staking',
    isActive: true,
    executionCount: 34,
    lastExecuted: '2024-01-15T07:45:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T07:45:00Z',
    category: 'vechain',
    tags: ['staking', 'rewards', 'compound', 'automation']
  }
]

export const getMockFlows = (): MockFlow[] => {
  return mockFlows.map(flow => ({
    ...flow,
    lastExecuted: flow.lastExecuted ? new Date(flow.lastExecuted).toISOString() : undefined,
    createdAt: new Date(flow.createdAt).toISOString(),
    updatedAt: new Date(flow.updatedAt).toISOString()
  }))
}

export const getMockFlowById = (id: string): MockFlow | undefined => {
  return mockFlows.find(flow => flow.id === id)
}

export const getMockFlowsByCategory = (category: string): MockFlow[] => {
  return mockFlows.filter(flow => flow.category === category)
}

export const getMockFlowsByTag = (tag: string): MockFlow[] => {
  return mockFlows.filter(flow => flow.tags.includes(tag))
}


