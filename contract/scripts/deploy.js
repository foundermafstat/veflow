const { ethers } = require("hardhat");
const { thor } = require("@vechain/sdk-core");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get VET balance (optional, may not work in all environments)
  try {
    const balance = await thor.accounts.getAccount(deployer.address);
    console.log("Account VET balance:", balance.balance);
    console.log("Account energy:", balance.energy);
  } catch (error) {
    console.log("Could not get account balance (this is normal for some networks)");
  }

  // Deploy VeFlowAccessControl (base contract)
  console.log("\n1. Deploying VeFlowAccessControl...");
  const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
  const accessControl = await VeFlowAccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("VeFlowAccessControl deployed to:", accessControlAddress);

  // Deploy VeFlowRegistry
  console.log("\n2. Deploying VeFlowRegistry...");
  const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
  const registry = await VeFlowRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("VeFlowRegistry deployed to:", registryAddress);

  // Deploy VeFlowBilling
  console.log("\n3. Deploying VeFlowBilling...");
  const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
  const billing = await VeFlowBilling.deploy();
  await billing.waitForDeployment();
  const billingAddress = await billing.getAddress();
  console.log("VeFlowBilling deployed to:", billingAddress);

  // Deploy VeFlowExecutor
  console.log("\n4. Deploying VeFlowExecutor...");
  const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
  const executor = await VeFlowExecutor.deploy();
  await executor.waitForDeployment();
  const executorAddress = await executor.getAddress();
  console.log("VeFlowExecutor deployed to:", executorAddress);

  // Deploy VeFlowOrchestrator
  console.log("\n5. Deploying VeFlowOrchestrator...");
  const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
  const orchestrator = await VeFlowOrchestrator.deploy(registryAddress, billingAddress);
  await orchestrator.waitForDeployment();
  const orchestratorAddress = await orchestrator.getAddress();
  console.log("VeFlowOrchestrator deployed to:", orchestratorAddress);

  // Deploy ProxyAdmin for upgradeability
  console.log("\n6. Deploying ProxyAdmin...");
  const VeFlowProxyAdmin = await ethers.getContractFactory("VeFlowProxyAdmin");
  const proxyAdmin = await VeFlowProxyAdmin.deploy();
  await proxyAdmin.waitForDeployment();
  const proxyAdminAddress = await proxyAdmin.getAddress();
  console.log("ProxyAdmin deployed to:", proxyAdminAddress);

  // Deploy proxies for main contracts
  console.log("\n7. Deploying proxies...");
  
  // Registry Proxy
  const VeFlowProxy = await ethers.getContractFactory("VeFlowProxy");
  const registryProxy = await VeFlowProxy.deploy(registryAddress, proxyAdminAddress, "0x");
  await registryProxy.waitForDeployment();
  const registryProxyAddress = await registryProxy.getAddress();
  console.log("Registry Proxy deployed to:", registryProxyAddress);

  // Billing Proxy
  const billingProxy = await VeFlowProxy.deploy(billingAddress, proxyAdminAddress, "0x");
  await billingProxy.waitForDeployment();
  const billingProxyAddress = await billingProxy.getAddress();
  console.log("Billing Proxy deployed to:", billingProxyAddress);

  // Executor Proxy
  const executorProxy = await VeFlowProxy.deploy(executorAddress, proxyAdminAddress, "0x");
  await executorProxy.waitForDeployment();
  const executorProxyAddress = await executorProxy.getAddress();
  console.log("Executor Proxy deployed to:", executorProxyAddress);

  // Orchestrator Proxy
  const orchestratorProxy = await VeFlowProxy.deploy(orchestratorAddress, proxyAdminAddress, "0x");
  await orchestratorProxy.waitForDeployment();
  const orchestratorProxyAddress = await orchestratorProxy.getAddress();
  console.log("Orchestrator Proxy deployed to:", orchestratorProxyAddress);

  // Setup initial roles and permissions
  console.log("\n8. Setting up roles and permissions...");
  
  // Grant necessary roles to orchestrator proxy
  const registryContract = await ethers.getContractAt("VeFlowRegistry", registryProxyAddress);
  const billingContract = await ethers.getContractAt("VeFlowBilling", billingProxyAddress);
  const executorContract = await ethers.getContractAt("VeFlowExecutor", executorProxyAddress);
  const orchestratorContract = await ethers.getContractAt("VeFlowOrchestrator", orchestratorProxyAddress);

  // Grant EXECUTOR_ROLE to orchestrator
  await registryContract.grantRole(await registryContract.EXECUTOR_ROLE(), orchestratorProxyAddress);
  await billingContract.grantRole(await billingContract.BILLING_MANAGER_ROLE(), orchestratorProxyAddress);

  console.log("Roles and permissions configured successfully!");

  // Save deployment info
  const deploymentInfo = {
    network: process.env.NETWORK || "vechain_testnet",
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contracts: {
      VeFlowAccessControl: accessControlAddress,
      VeFlowRegistry: {
        implementation: registryAddress,
        proxy: registryProxyAddress
      },
      VeFlowBilling: {
        implementation: billingAddress,
        proxy: billingProxyAddress
      },
      VeFlowExecutor: {
        implementation: executorAddress,
        proxy: executorProxyAddress
      },
      VeFlowOrchestrator: {
        implementation: orchestratorAddress,
        proxy: orchestratorProxyAddress
      },
      ProxyAdmin: proxyAdminAddress
    }
  };

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n=== NEXT STEPS ===");
  console.log("1. Copy the contract addresses above");
  console.log("2. Verify contracts on VeChain explorer");
  console.log("3. Update frontend configuration with proxy addresses");
  console.log("4. Test contract functionality");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
