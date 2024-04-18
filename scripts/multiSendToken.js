const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const MultiSendToken = await ethers.getContractFactory("MultiSendToken");
  console.log("Deploying MultiSendToken...");
  const contract = await MultiSendToken.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("MultiSendToken deployed to:", addr);

  await testV1(signers, addr);
}

// TEST
async function testV1(signers, addr) {
  const f = await ethers.getContractFactory("MultiSendToken");
  const c = await f.attach(addr);
  let b = await c.owner();
  console.log(b);
}

main();
