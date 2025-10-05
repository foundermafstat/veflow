const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🔍 Генерация адреса кошелька из мнемонической фразы...");
  
  try {
    // Мнемоническая фраза из .env файла
    const mnemonic = "spot march isolate crouch mansion skirt below swallow wrong drive nominee unknown";
    
    // Создаем HDWallet из мнемонической фразы
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    
    console.log("\n📋 Информация о кошельке:");
    console.log("=" .repeat(50));
    console.log(`Мнемоническая фраза: ${mnemonic}`);
    console.log(`Адрес кошелька: ${wallet.address}`);
    console.log(`Приватный ключ: ${wallet.privateKey}`);
    
    console.log("\n💰 Получите тестовые VET:");
    console.log("1. Перейдите на: https://faucet.vecha.in/");
    console.log(`2. Введите адрес: ${wallet.address}`);
    console.log("3. Запросите тестовые VET");
    
    console.log("\n🚀 После получения VET запустите деплой:");
    console.log("npm run deploy:testnet");
    
    console.log("\n⚠️  ВАЖНО:");
    console.log("- Это тестовая мнемоническая фраза");
    console.log("- Используйте только для разработки");
    console.log("- Никогда не используйте для mainnet");
    
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
