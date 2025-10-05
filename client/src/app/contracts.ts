// VeFlow Smart Contracts Configuration
// Deployed on VeChain Testnet

export const VEFLOW_CONTRACTS = {
  // Network configuration
  network: 'testnet',
  chainId: 100010, // VeChain Testnet
  
  // Contract addresses (deployed on VeChain Testnet)
  contracts: {
    // Base contracts
    VeFlowAccessControl: '0x13bd4b8be050754126b3da85bd14e3485da1a687',
    
    // Proxy contracts (use these for interactions)
    VeFlowRegistry: {
      implementation: '0xa61ecda270f168705cc0d14c3b428937005c2c07',
      proxy: '0xa61ecda270f168705cc0d14c3b428937005c2c07'
    },
    
    VeFlowBilling: {
      implementation: '0x087379f73b8803377afa134156fcc4baf9fa5f3f',
      proxy: '0x087379f73b8803377afa134156fcc4baf9fa5f3f'
    },
    
    VeFlowExecutor: {
      implementation: '0x0000000000000000000000000000000000000000', // Will be updated when transaction is confirmed
      proxy: '0x0000000000000000000000000000000000000000' // Will be updated when transaction is confirmed
    },
    
    VeFlowOrchestrator: {
      implementation: '0x0000000000000000000000000000000000000000', // Will be updated when transaction is confirmed
      proxy: '0x0000000000000000000000000000000000000000' // Will be updated when transaction is confirmed
    },
    
    ProxyAdmin: '0x0000000000000000000000000000000000000000' // Will be updated when transaction is confirmed
  },
  
  // Transaction hashes for verification
  transactions: {
    VeFlowAccessControl: '0x13bd4b8be050754126b3da85bd14e3485da1a687',
    VeFlowRegistry: '0xb16b70a5bdfcc5fbaa48e7184bcc3735d5fd2f6a58d5c0e54b3f39d051471225',
    VeFlowBilling: '0x7dead7e5eb0653f1122eebac86f98d187f2fc59bea13d269d1350ea31ea0e998',
    VeFlowExecutor: '0x0000000000000000000000000000000000000000', // Will be updated
    VeFlowOrchestrator: '0x0000000000000000000000000000000000000000' // Will be updated
  },
  
  // Explorer URLs
  explorer: {
    base: 'https://explore-testnet.vechain.org',
    transaction: (txHash: string) => `https://explore-testnet.vechain.org/transactions/${txHash}`,
    address: (address: string) => `https://explore-testnet.vechain.org/accounts/${address}`
  }
} as const;

// Helper functions
export const getContractAddress = (contractName: keyof typeof VEFLOW_CONTRACTS.contracts) => {
  const contract = VEFLOW_CONTRACTS.contracts[contractName];
  if (typeof contract === 'string') {
    return contract;
  }
  return contract.proxy; // Return proxy address for upgradeable contracts
};

export const getExplorerUrl = (type: 'transaction' | 'address', hash: string) => {
  return VEFLOW_CONTRACTS.explorer[type](hash);
};

// Export individual contract addresses for convenience
export const {
  VeFlowAccessControl,
  VeFlowRegistry,
  VeFlowBilling,
  VeFlowExecutor,
  VeFlowOrchestrator,
  ProxyAdmin
} = VEFLOW_CONTRACTS.contracts;
