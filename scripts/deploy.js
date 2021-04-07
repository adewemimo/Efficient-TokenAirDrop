//const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const AirDropMultiTokens = await ethers.getContractFactory("AirDropMultiTokens");
  const airDropMultiTokens = await AirDropMultiTokens.deploy();

  await airDropMultiTokens.deployed();

  console.log("airDropMultiTokens deployed to:", airDropMultiTokens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
