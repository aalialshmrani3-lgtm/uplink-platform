import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying UplinkContract to Polygon Mumbai Testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");

  // Deploy the contract
  const UplinkContract = await ethers.getContractFactory("UplinkContract");
  const uplinkContract = await UplinkContract.deploy();

  await uplinkContract.waitForDeployment();

  const contractAddress = await uplinkContract.getAddress();
  console.log("✅ UplinkContract deployed to:", contractAddress);
  console.log("🔗 View on PolygonScan:", `https://mumbai.polygonscan.com/address/${contractAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network: "polygonMumbai",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("\n📋 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
