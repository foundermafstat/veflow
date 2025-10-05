const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddresses = {
    VeFlowRegistry: "0xc03db9560d8be616748b1b158d5fb99094e33f41",
    VeFlowBilling: "0xd5ec015a300d5c6d42abeb4004ded409c0d7e24d",
    VeFlowExecutor: "0x9ee3fa7ea944f843b395673c88f7423eed05406d",
    VeFlowOrchestrator: "0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b",
    VeFlowAccessControl: "0xed31f42a4a6ffc6a80195b7c56f6cb23dfbacc7e",
    ProxyAdmin: "0x9bf463e21e6964fe34c499ca0067b1be14e0c5b4"
  };

  console.log("🔍 Checking VeFlow Contract Verification Status");
  console.log("=" .repeat(60));

  for (const [name, address] of Object.entries(contractAddresses)) {
    console.log(`\n📋 ${name}`);
    console.log(`Address: ${address}`);
    console.log(`Explorer: https://explore-testnet.vechain.org/transactions/${address}`);
    
    try {
      // Try to get contract info
      const contract = await ethers.getContractAt(name, address);
      console.log(`✅ Contract accessible via ethers`);
      
      // Check if we can call a basic function
      if (name === "VeFlowAccessControl") {
        try {
          const hasAdminRole = await contract.hasRole(await contract.DEFAULT_ADMIN_ROLE(), address);
          console.log(`✅ Contract functions accessible`);
        } catch (error) {
          console.log(`⚠️  Contract deployed but functions may not be accessible`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Contract not accessible: ${error.message}`);
    }
  }

  console.log("\n" + "=" .repeat(60));
  console.log("📝 Manual Verification Required");
  console.log("=" .repeat(60));
  console.log("VeChain testnet requires manual contract verification.");
  console.log("Please use the VeChain Explorer links above to verify each contract.");
  console.log("\n📖 See VERIFICATION_GUIDE.md for detailed instructions.");
  
  console.log("\n🔗 Quick Links:");
  Object.entries(contractAddresses).forEach(([name, address]) => {
    console.log(`${name}: https://explore-testnet.vechain.org/transactions/${address}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error checking verification status:", error);
    process.exit(1);
  });
