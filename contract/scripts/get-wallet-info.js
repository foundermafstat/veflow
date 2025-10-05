const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Получение информации о кошельке...");
  
  try {
    // Получаем аккаунты из мнемонической фразы
    const accounts = await ethers.getSigners();
    
    console.log("\n📋 Информация о кошельках:");
    console.log("=" .repeat(50));
    
    for (let i = 0; i < Math.min(accounts.length, 3); i++) {
      const account = accounts[i];
      const address = await account.getAddress();
      
      console.log(`\nКошелек ${i + 1}:`);
      console.log(`Адрес: ${address}`);
      
      // Попробуем получить баланс (может не работать в локальной сети)
      try {
        const balance = await ethers.provider.getBalance(address);
        console.log(`Баланс ETH: ${ethers.formatEther(balance)} ETH`);
      } catch (error) {
        console.log(`Баланс: Не удалось получить (нормально для локальной сети)`);
      }
    }
    
    console.log("\n🎯 Для деплоя используйте первый адрес:");
    const deployerAddress = await accounts[0].getAddress();
    console.log(`Deployer: ${deployerAddress}`);
    
    console.log("\n💰 Получите тестовые VET:");
    console.log("1. Перейдите на: https://faucet.vecha.in/");
    console.log(`2. Введите адрес: ${deployerAddress}`);
    console.log("3. Запросите тестовые VET");
    
    console.log("\n🚀 После получения VET запустите деплой:");
    console.log("npm run deploy:testnet");
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

