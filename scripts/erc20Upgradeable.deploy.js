const { ethers, upgrades } = require("hardhat");

async function main() {
  const ERC20UpgradeableV1 = await ethers.getContractFactory(
    "ERC20UpgradeableV1"
  );
  console.log("Deploying ERC20UpgradeableV1...");
  const contract = await upgrades.deployProxy(ERC20UpgradeableV1, [], {
    initializer: "initialize",
    kind: "transparent",
  });
  await contract.deployed();
  console.log("ERC20UpgradeableV1 deployed to:", contract.address);
}

main();
