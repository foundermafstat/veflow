const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Upgrading contracts with account:", deployer.address);

  // Contract addresses (replace with actual deployed addresses)
  const contractAddresses = {
    VeFlowRegistry: "0x...", // Proxy address
    VeFlowBilling: "0x...", // Proxy address
    VeFlowExecutor: "0x...", // Proxy address
    VeFlowOrchestrator: "0x...", // Proxy address
    ProxyAdmin: "0x..."
  };

  try {
    // Upgrade VeFlowRegistry
    console.log("\n1. Upgrading VeFlowRegistry...");
    const VeFlowRegistryV2 = await ethers.getContractFactory("VeFlowRegistry");
    const registryUpgrade = await upgrades.upgradeProxy(contractAddresses.VeFlowRegistry, VeFlowRegistryV2);
    await registryUpgrade.waitForDeployment();
    console.log("✓ VeFlowRegistry upgraded");

    // Upgrade VeFlowBilling
    console.log("\n2. Upgrading VeFlowBilling...");
    const VeFlowBillingV2 = await ethers.getContractFactory("VeFlowBilling");
    const billingUpgrade = await upgrades.upgradeProxy(contractAddresses.VeFlowBilling, VeFlowBillingV2);
    await billingUpgrade.waitForDeployment();
    console.log("✓ VeFlowBilling upgraded");

    // Upgrade VeFlowExecutor
    console.log("\n3. Upgrading VeFlowExecutor...");
    const VeFlowExecutorV2 = await ethers.getContractFactory("VeFlowExecutor");
    const executorUpgrade = await upgrades.upgradeProxy(contractAddresses.VeFlowExecutor, VeFlowExecutorV2);
    await executorUpgrade.waitForDeployment();
    console.log("✓ VeFlowExecutor upgraded");

    // Note: Orchestrator upgrade requires special handling due to constructor parameters
    console.log("\n⚠️  Orchestrator upgrade requires manual proxy admin upgrade");
    console.log("Use ProxyAdmin contract to upgrade Orchestrator implementation");

    console.log("\n🎉 Contract upgrades completed!");

  } catch (error) {
    console.error("Upgrade failed:", error);
    
    if (error.message.includes("Storage layout")) {
      console.log("\n⚠️  Storage layout incompatible. Check contract changes.");
    } else if (error.message.includes("Admin")) {
      console.log("\n⚠️  Admin access required. Ensure deployer has admin role.");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


