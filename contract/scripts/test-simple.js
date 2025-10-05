const { ethers } = require("hardhat");

async function main() {
  console.log("Testing VeFlow contract compilation and deployment...");
  
  try {
    // Test compilation
    console.log("\n1. Testing contract compilation...");
    const VeFlowAccessControl = await ethers.getContractFactory("VeFlowAccessControl");
    console.log("✓ VeFlowAccessControl compiled successfully");
    
    const VeFlowRegistry = await ethers.getContractFactory("VeFlowRegistry");
    console.log("✓ VeFlowRegistry compiled successfully");
    
    const VeFlowBilling = await ethers.getContractFactory("VeFlowBilling");
    console.log("✓ VeFlowBilling compiled successfully");
    
    const VeFlowExecutor = await ethers.getContractFactory("VeFlowExecutor");
    console.log("✓ VeFlowExecutor compiled successfully");
    
    const VeFlowOrchestrator = await ethers.getContractFactory("VeFlowOrchestrator");
    console.log("✓ VeFlowOrchestrator compiled successfully");

    // Test deployment
    console.log("\n2. Testing contract deployment...");
    
    const accessControl = await VeFlowAccessControl.deploy();
    await accessControl.waitForDeployment();
    const accessControlAddress = await accessControl.getAddress();
    console.log("✓ VeFlowAccessControl deployed to:", accessControlAddress);

    const registry = await VeFlowRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("✓ VeFlowRegistry deployed to:", registryAddress);

    const billing = await VeFlowBilling.deploy();
    await billing.waitForDeployment();
    const billingAddress = await billing.getAddress();
    console.log("✓ VeFlowBilling deployed to:", billingAddress);

    const executor = await VeFlowExecutor.deploy();
    await executor.waitForDeployment();
    const executorAddress = await executor.getAddress();
    console.log("✓ VeFlowExecutor deployed to:", executorAddress);

    const orchestrator = await VeFlowOrchestrator.deploy(registryAddress, billingAddress);
    await orchestrator.waitForDeployment();
    const orchestratorAddress = await orchestrator.getAddress();
    console.log("✓ VeFlowOrchestrator deployed to:", orchestratorAddress);

    console.log("\n🎉 All contracts compiled and deployed successfully!");
    
    // Test basic functionality
    console.log("\n3. Testing basic functionality...");
    
    // Get deployer address
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Test blueprint registration
    const AUTHOR_ROLE = await registry.AUTHOR_ROLE();
    await registry.grantRole(AUTHOR_ROLE, deployer.address);
    
    const tx = await registry.registerBlueprint("https://example.com/metadata.json");
    await tx.wait();
    console.log("✓ Blueprint registration works");
    
    // Test billing deposit
    const depositTx = await billing.deposit(deployer.address, { value: ethers.parseEther("0.1") });
    await depositTx.wait();
    console.log("✓ Billing deposit works");
    
    // Test flow creation
    const linkTx = await orchestrator.linkBlueprints([1]);
    await linkTx.wait();
    console.log("✓ Flow creation works");

    console.log("\n🎉 All functionality tests passed!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

