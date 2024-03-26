const { ethers, upgrades } = require("hardhat");

const prevAddr = ""; // "0xC81cBaB47B1e6D6d20d4742721e29f22C5835dcB";

async function main() {
  const ERC20UpgradeableV2 = await ethers.getContractFactory(
    "ERC20UpgradeableV2"
  );
  console.log("Upgrading ERC20UpgradeableV1...");
  await upgrades.upgradeProxy(prevAddr, ERC20UpgradeableV2);
  console.log("Upgraded Successfully");
}

main();
