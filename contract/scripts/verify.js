const { run } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddresses = {
    // Actual deployed addresses
    VeFlowRegistry: "0xc03db9560d8be616748b1b158d5fb99094e33f41",
    VeFlowBilling: "0xd5ec015a300d5c6d42abeb4004ded409c0d7e24d",
    VeFlowExecutor: "0x9ee3fa7ea944f843b395673c88f7423eed05406d",
    VeFlowOrchestrator: "0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b",
    VeFlowAccessControl: "0xed31f42a4a6ffc6a80195b7c56f6cb23dfbacc7e",
    ProxyAdmin: "0x9bf463e21e6964fe34c499ca0067b1be14e0c5b4"
  };

  const network = process.env.NETWORK || "vechain_testnet";
  
  console.log(`Verifying contracts on ${network}...`);
  console.log("\n📋 Contract Addresses:");
  console.log(`VeFlowRegistry: ${contractAddresses.VeFlowRegistry}`);
  console.log(`VeFlowBilling: ${contractAddresses.VeFlowBilling}`);
  console.log(`VeFlowExecutor: ${contractAddresses.VeFlowExecutor}`);
  console.log(`VeFlowOrchestrator: ${contractAddresses.VeFlowOrchestrator}`);
  console.log(`VeFlowAccessControl: ${contractAddresses.VeFlowAccessControl}`);
  console.log(`ProxyAdmin: ${contractAddresses.ProxyAdmin}`);

  console.log("\n🔍 VeChain Testnet Explorer Links:");
  console.log(`VeFlowRegistry: https://explore-testnet.vechain.org/transactions/${contractAddresses.VeFlowRegistry}`);
  console.log(`VeFlowBilling: https://explore-testnet.vechain.org/transactions/${contractAddresses.VeFlowBilling}`);
  console.log(`VeFlowExecutor: https://explore-testnet.vechain.org/transactions/${contractAddresses.VeFlowExecutor}`);
  console.log(`VeFlowOrchestrator: https://explore-testnet.vechain.org/transactions/${contractAddresses.VeFlowOrchestrator}`);
  console.log(`VeFlowAccessControl: https://explore-testnet.vechain.org/transactions/${contractAddresses.VeFlowAccessControl}`);
  console.log(`ProxyAdmin: https://explore-testnet.vechain.org/transactions/${contractAddresses.ProxyAdmin}`);

  console.log("\n⚠️  Note: VeChain testnet doesn't support automatic contract verification through Hardhat.");
  console.log("📝 Manual verification is required through the VeChain Explorer.");
  console.log("\n🔧 Manual Verification Steps:");
  console.log("1. Visit each contract address in the VeChain Explorer");
  console.log("2. Click 'Verify Contract' if available");
  console.log("3. Upload the source code and provide constructor arguments");
  console.log("4. Submit for verification");

  console.log("\n📄 Source Code Files:");
  console.log("- contracts/VeFlowAccessControl.sol");
  console.log("- contracts/VeFlowRegistry.sol");
  console.log("- contracts/VeFlowBilling.sol");
  console.log("- contracts/VeFlowExecutor.sol");
  console.log("- contracts/VeFlowOrchestrator.sol");
  console.log("- contracts/VeFlowProxy.sol");

  console.log("\n🏗️  Constructor Arguments:");
  console.log("VeFlowAccessControl: [] (no arguments)");
  console.log("VeFlowRegistry: [] (no arguments)");
  console.log("VeFlowBilling: [] (no arguments)");
  console.log("VeFlowExecutor: [] (no arguments)");
  console.log(`VeFlowOrchestrator: ["${contractAddresses.VeFlowRegistry}", "${contractAddresses.VeFlowBilling}"]`);
  console.log("ProxyAdmin: [] (no arguments)");

  console.log("\n✅ Contract verification information provided!");
  console.log("Please use the VeChain Explorer links above to manually verify each contract.");
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


