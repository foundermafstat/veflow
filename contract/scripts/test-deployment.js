const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Testing contract deployment with account:", deployer.address);

  try {
    // Test VeFlowAccessControl deployment
    console.log("\n1. Testing VeFlowAccessControl...");
    const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
    const accessControl = await VeFlowAccessControl.deploy();
    await accessControl.waitForDeployment();
    console.log("✓ VeFlowAccessControl deployed successfully");

    // Test VeFlowRegistry deployment
    console.log("\n2. Testing VeFlowRegistry...");
    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    const registry = await VeFlowRegistry.deploy();
    await registry.waitForDeployment();
    console.log("✓ VeFlowRegistry deployed successfully");

    // Test VeFlowBilling deployment
    console.log("\n3. Testing VeFlowBilling...");
    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    const billing = await VeFlowBilling.deploy();
    await billing.waitForDeployment();
    console.log("✓ VeFlowBilling deployed successfully");

    // Test VeFlowExecutor deployment
    console.log("\n4. Testing VeFlowExecutor...");
    const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
    const executor = await VeFlowExecutor.deploy();
    await executor.waitForDeployment();
    console.log("✓ VeFlowExecutor deployed successfully");

    // Test VeFlowOrchestrator deployment
    console.log("\n5. Testing VeFlowOrchestrator...");
    const registryAddress = await registry.getAddress();
    const billingAddress = await billing.getAddress();
    
    const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
    const orchestrator = await VeFlowOrchestrator.deploy(registryAddress, billingAddress);
    await orchestrator.waitForDeployment();
    console.log("✓ VeFlowOrchestrator deployed successfully");

    // Test basic functionality
    console.log("\n6. Testing basic functionality...");
    
    // Test blueprint registration
    const AUTHOR_ROLE = await registry.AUTHOR_ROLE();
    await registry.grantRole(AUTHOR_ROLE, deployer.address);
    
    const tx = await registry.registerBlueprint("https://example.com/metadata.json");
    const receipt = await tx.wait();
    console.log("✓ Blueprint registration works");
    
    // Test billing deposit
    const depositTx = await billing.deposit(deployer.address, { value: ethers.parseEther("0.1") });
    await depositTx.wait();
    console.log("✓ Billing deposit works");
    
    // Test flow creation
    const linkTx = await orchestrator.linkBlueprints([1]);
    await linkTx.wait();
    console.log("✓ Flow creation works");

    console.log("\n🎉 All deployment tests passed!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


