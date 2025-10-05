Title: VeFlow Smart Contract Suite — VeChain Testnet (Hardhat)

Objective:
Develop a modular, secure, and upgradeable Solidity-based smart contract system named VeFlow.
VeFlow is a next-generation scenario builder that manages modular blueprints, endpoint registries, and orchestrated on-chain/off-chain executions.
It integrates with AI or off-chain agents for dynamic execution and maintains full compatibility with VeChainThor (EVM-compatible) via Hardhat.

1. Contract Architecture

Create a multi-contract architecture consisting of:

VeFlowRegistry.sol — manages registration and versioning of Blueprints.

VeFlowOrchestrator.sol — orchestrates flow execution, emitting events for off-chain workers.

VeFlowExecutor.sol — handles step execution and safe external calls.

VeFlowBilling.sol — manages payment accounting (supports VTHO-based gas model).

VeFlowAccessControl.sol — role-based permissions using AccessControl.

VeFlowProxy.sol and ProxyAdmin.sol — support upgradeability (Transparent Proxy pattern).

2. Core Logic & Data Models
Blueprint Structure
struct Blueprint {
    uint256 id;
    address author;
    string metadataURI; // direct storage reference (no IPFS)
    uint16 version;
    bool active;
    uint256 createdAt;
}

Core Events
event BlueprintRegistered(uint256 indexed id, address indexed author, uint16 version);
event BlueprintUpdated(uint256 indexed id, uint16 newVersion);
event FlowExecuted(uint256 indexed flowId, address indexed executor, uint256 timestamp);
event ExecutionResult(uint256 indexed flowId, uint256 stepIndex, bytes result);
event EndpointRegistered(bytes32 indexed endpointId, address target);

Public Functions (API Endpoints)
function registerBlueprint(string calldata metadataURI) external returns (uint256 blueprintId);
function updateBlueprint(uint256 blueprintId, string calldata metadataURI) external;
function linkBlueprints(uint256[] calldata orderedBlueprintIds) external returns (uint256 flowId);
function startFlow(uint256 flowId, bytes calldata input) external payable returns (uint256 executionId);
function executeStep(uint256 executionId, uint256 stepIndex, bytes calldata stepOutput, bytes calldata executorSig) external returns (bytes memory);
function registerEndpoint(bytes32 endpointId, address target, bytes4 selector) external;
function deposit(address payer) external payable;
function withdraw(uint256 amount) external;
function pause() external;
function unpause() external;

3. Role-Based Access Control

Use OpenZeppelin’s AccessControl with the following roles:

DEFAULT_ADMIN_ROLE

AUTHOR_ROLE

EXECUTOR_ROLE

BILLING_MANAGER_ROLE

4. Security & Design Patterns

Implement ReentrancyGuard for sensitive calls.

Follow the Check-Effects-Interactions pattern.

Use Pausable to enable emergency stop (circuit breaker).

Validate executeStep inputs and authorized signers.

Enforce signed results from registered off-chain executors (EIP-712 typed signatures).

Use Initializable + UUPSUpgradeable for proxy-safe upgradeable deployment.

5. On-chain ↔ Off-chain Interaction

When startFlow() is called, the contract emits FlowExecuted(flowId, executor, timestamp).

Off-chain AI/LLM workers listen for these events, process the scenario described in metadataURI, and send results back through executeStep(...).

The on-chain contract verifies that the sender or signature belongs to an address with the EXECUTOR_ROLE.

Metadata is stored as a plain URI (https or other), not via IPFS.

6. Billing and Gas Accounting

Users deposit VTHO or equivalent testnet token via deposit().

Each Blueprint step may have a defined fee (setStepFee()), deducted per execution.

VeFlowBilling manages balances, withdrawals, and billing events.

7. Upgradeability

Implement a Transparent Proxy pattern using OpenZeppelin proxies.

Maintain upgrade control through ProxyAdmin.

Each contract uses Initializable for proxy-safe constructors.

Preserve storage layout carefully across upgrades.

8. Deployment Configuration (Hardhat + VeChain Testnet)

Network config (hardhat.config.js):

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    vechain_testnet: {
      url: "https://testnet.veblocks.net",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 100010,
    },
  },
};


Deploy script (scripts/deploy.js):

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const Registry = await ethers.getContractFactory("VeFlowRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log("VeFlowRegistry deployed at:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

9. Project Structure
/contracts
  VeFlowRegistry.sol
  VeFlowOrchestrator.sol
  VeFlowExecutor.sol
  VeFlowBilling.sol
  VeFlowAccessControl.sol
  VeFlowProxy.sol
  ProxyAdmin.sol

/scripts
  deploy.js
  verify.js

/test
  veFlow.test.js

/hardhat.config.js
/.env

10. Testing Suite

Use Mocha/Chai and Hardhat Network for testing.

Unit Tests:

Register/update Blueprints.

Start and execute flows.

Verify signature-based executor actions.

Access control restrictions.

Pause/unpause safety.

Integration Tests:

Simulate an off-chain worker that listens to events and responds with a signed executeStep() call.

11. Dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
npm install @vechain/sdk-core

12. Expected Output

Cursor should:

Generate all contract files and interfaces.

Set up Hardhat for VeChain testnet deployment.

Include deploy.js for full deployment (Registry + Orchestrator + Billing + Proxy).

Provide working unit tests for roles, executions, and events.

Use plain URIs (not IPFS) for metadata references.