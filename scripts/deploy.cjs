const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to Creditcoin Testnet...");

  // Deploy LoanLensScoreRegistry
  console.log("Deploying LoanLensScoreRegistry...");
  const LoanLensScoreRegistry = await hre.ethers.getContractFactory("LoanLensScoreRegistry");
  const registry = await LoanLensScoreRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`LoanLensScoreRegistry deployed to: ${registryAddress}`);

  // Deploy LoanLensCreditNFT
  console.log("Deploying LoanLensCreditNFT...");
  const LoanLensCreditNFT = await hre.ethers.getContractFactory("LoanLensCreditNFT");
  const nft = await LoanLensCreditNFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log(`LoanLensCreditNFT deployed to: ${nftAddress}`);

  console.log("\nDeployment Complete!");
  console.log("-----------------------------------------");
  console.log("LoanLensScoreRegistry:", registryAddress);
  console.log("LoanLensCreditNFT:", nftAddress);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
