// ABI definitions for VeFlow smart contracts

export const VEFLOW_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "getBlueprintCount",
    "outputs": [{"internalType": "uint256", "name": "count", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "getBlueprint",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "author", "type": "address"},
        {"internalType": "string", "name": "metadataURI", "type": "string"},
        {"internalType": "uint16", "name": "version", "type": "uint16"},
        {"internalType": "bool", "name": "active", "type": "bool"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
      ],
      "internalType": "struct VeFlowRegistry.Blueprint",
      "name": "blueprint",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "isBlueprintValid",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "author", "type": "address"}],
    "name": "getBlueprintsByAuthor",
    "outputs": [{"internalType": "uint256[]", "name": "blueprintIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "metadataURI", "type": "string"}],
    "name": "registerBlueprint",
    "outputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "blueprintId", "type": "uint256"},
      {"internalType": "string", "name": "metadataURI", "type": "string"}
    ],
    "name": "updateBlueprint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "deactivateBlueprint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "author", "type": "address"},
      {"indexed": false, "internalType": "uint16", "name": "version", "type": "uint16"}
    ],
    "name": "BlueprintRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "uint16", "name": "newVersion", "type": "uint16"}
    ],
    "name": "BlueprintUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "BlueprintDeactivated",
    "type": "event"
  }
] as const

export const VEFLOW_ORCHESTRATOR_ABI = [
  {
    "inputs": [{"internalType": "uint256[]", "name": "orderedBlueprintIds", "type": "uint256[]"}],
    "name": "linkBlueprints",
    "outputs": [{"internalType": "uint256", "name": "flowId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "flowId", "type": "uint256"},
      {"internalType": "bytes", "name": "input", "type": "bytes"}
    ],
    "name": "startFlow",
    "outputs": [{"internalType": "uint256", "name": "executionId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "flowId", "type": "uint256"}],
    "name": "getFlowBlueprints",
    "outputs": [{"internalType": "uint256[]", "name": "blueprintIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "executionId", "type": "uint256"}],
    "name": "getFlowExecution",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "flowId", "type": "uint256"},
        {"internalType": "uint256[]", "name": "blueprintIds", "type": "uint256[]"},
        {"internalType": "address", "name": "executor", "type": "address"},
        {"internalType": "bytes", "name": "inputData", "type": "bytes"},
        {"internalType": "uint256", "name": "currentStep", "type": "uint256"},
        {"internalType": "bool", "name": "completed", "type": "bool"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
        {"internalType": "uint256", "name": "totalSteps", "type": "uint256"}
      ],
      "internalType": "struct VeFlowOrchestrator.FlowExecution",
      "name": "execution",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "executor", "type": "address"}],
    "name": "getExecutionsByExecutor",
    "outputs": [{"internalType": "uint256[]", "name": "executionIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "executionId", "type": "uint256"}],
    "name": "isExecutionCompleted",
    "outputs": [{"internalType": "bool", "name": "completed", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "executionId", "type": "uint256"},
      {"internalType": "uint256", "name": "stepIndex", "type": "uint256"},
      {"internalType": "bytes", "name": "stepOutput", "type": "bytes"},
      {"internalType": "bytes", "name": "executorSig", "type": "bytes"}
    ],
    "name": "executeStep",
    "outputs": [{"internalType": "bytes", "name": "result", "type": "bytes"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "flowId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256[]", "name": "blueprintIds", "type": "uint256[]"}
    ],
    "name": "FlowCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "flowId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "executor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "executionId", "type": "uint256"}
    ],
    "name": "FlowExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "flowId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "stepIndex", "type": "uint256"},
      {"indexed": false, "internalType": "bytes", "name": "result", "type": "bytes"}
    ],
    "name": "ExecutionResult",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "flowId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "executionId", "type": "uint256"}
    ],
    "name": "FlowCompleted",
    "type": "event"
  }
] as const

export const VEFLOW_BILLING_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "payer", "type": "address"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "blueprintId", "type": "uint256"},
      {"internalType": "uint256", "name": "fee", "type": "uint256"}
    ],
    "name": "setStepFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "payer", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "deductFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "balance", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "blueprintId", "type": "uint256"}],
    "name": "getStepFee",
    "outputs": [{"internalType": "uint256", "name": "fee", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "payer", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "hasSufficientBalance",
    "outputs": [{"internalType": "bool", "name": "sufficient", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "payer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "payee", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "payer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "FeeDeducted",
    "type": "event"
  }
] as const

export const VEFLOW_ACCESS_CONTROL_ABI = [
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "isExecutor",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "isAuthor",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const VEFLOW_EXECUTOR_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "endpointId", "type": "bytes32"},
      {"internalType": "address", "name": "target", "type": "address"},
      {"internalType": "bytes4", "name": "selector", "type": "bytes4"}
    ],
    "name": "registerEndpoint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "endpointId", "type": "bytes32"}],
    "name": "deactivateEndpoint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "endpointId", "type": "bytes32"},
      {"internalType": "bytes", "name": "data", "type": "bytes"}
    ],
    "name": "executeExternalCall",
    "outputs": [
      {"internalType": "bool", "name": "success", "type": "bool"},
      {"internalType": "bytes", "name": "result", "type": "bytes"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "endpointId", "type": "bytes32"}],
    "name": "getEndpoint",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "target", "type": "address"},
        {"internalType": "bytes4", "name": "selector", "type": "bytes4"},
        {"internalType": "bool", "name": "active", "type": "bool"}
      ],
      "internalType": "struct VeFlowExecutor.Endpoint",
      "name": "endpoint",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "endpointId", "type": "bytes32"}],
    "name": "isEndpointValid",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract addresses (to be configured based on network)
export const CONTRACT_ADDRESSES = {
  // Testnet addresses (to be updated with actual deployed addresses)
  testnet: {
    registry: '0x0000000000000000000000000000000000000000', // Placeholder
    orchestrator: '0x0000000000000000000000000000000000000000', // Placeholder
    executor: '0x0000000000000000000000000000000000000000', // Placeholder
    billing: '0x0000000000000000000000000000000000000000', // Placeholder
  },
  // Mainnet addresses (to be updated with actual deployed addresses)
  mainnet: {
    registry: '0x0000000000000000000000000000000000000000', // Placeholder
    orchestrator: '0x0000000000000000000000000000000000000000', // Placeholder
    executor: '0x0000000000000000000000000000000000000000', // Placeholder
    billing: '0x0000000000000000000000000000000000000000', // Placeholder
  }
} as const

// Role constants
export const ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  AUTHOR_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000', // keccak256("AUTHOR_ROLE")
  EXECUTOR_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000', // keccak256("EXECUTOR_ROLE")
  BILLING_MANAGER_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000', // keccak256("BILLING_MANAGER_ROLE")
} as const
