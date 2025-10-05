const { run } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddresses = {
    // Replace with actual deployed addresses
    VeFlowRegistry: "0x...",
    VeFlowBilling: "0x...",
    VeFlowExecutor: "0x...",
    VeFlowOrchestrator: "0x...",
    ProxyAdmin: "0x..."
  };

  const network = process.env.NETWORK || "vechain_testnet";
  
  console.log(`Verifying contracts on ${network}...`);

  try {
    // Verify VeFlowRegistry
    console.log("\n1. Verifying VeFlowRegistry...");
    await run("verify:verify", {
      address: contractAddresses.VeFlowRegistry,
      constructorArguments: [],
    });
    console.log("✓ VeFlowRegistry verified");

    // Verify VeFlowBilling
    console.log("\n2. Verifying VeFlowBilling...");
    await run("verify:verify", {
      address: contractAddresses.VeFlowBilling,
      constructorArguments: [],
    });
    console.log("✓ VeFlowBilling verified");

    // Verify VeFlowExecutor
    console.log("\n3. Verifying VeFlowExecutor...");
    await run("verify:verify", {
      address: contractAddresses.VeFlowExecutor,
      constructorArguments: [],
    });
    console.log("✓ VeFlowExecutor verified");

    // Verify VeFlowOrchestrator
    console.log("\n4. Verifying VeFlowOrchestrator...");
    await run("verify:verify", {
      address: contractAddresses.VeFlowOrchestrator,
      constructorArguments: [contractAddresses.VeFlowRegistry, contractAddresses.VeFlowBilling],
    });
    console.log("✓ VeFlowOrchestrator verified");

    // Verify ProxyAdmin
    console.log("\n5. Verifying ProxyAdmin...");
    await run("verify:verify", {
      address: contractAddresses.ProxyAdmin,
      constructorArguments: [],
    });
    console.log("✓ ProxyAdmin verified");

    console.log("\n🎉 All contracts verified successfully!");
    
  } catch (error) {
    console.error("Verification failed:", error.message);
    
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified.");
    } else {
      console.log("Manual verification may be required.");
      console.log("Visit the VeChain explorer and verify contracts manually.");
    }
  }
}

// Function to verify individual contract
async function verifyContract(contractName, address, constructorArgs = []) {
  try {
    console.log(`\nVerifying ${contractName}...`);
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArgs,
    });
    console.log(`✓ ${contractName} verified`);
    return true;
  } catch (error) {
    console.error(`✗ ${contractName} verification failed:`, error.message);
    return false;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = { verifyContract };


