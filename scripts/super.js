const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const L4 = await ethers.getContractFactory("L4");
  console.log("Deploying L4...");
  const contract = await L4.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("L4 deployed to:", addr);

  await testV1(signers, addr);
}

// TEST
async function testV1(signers, addr) {
  const f = await ethers.getContractFactory("L4");
  const c = await f.attach(addr);
  let a1 = 0x10000;
  let a2 = 0x10000;
  let b = await c.suTest(a1, a2);
  // console.log(b);
  console.log(await ethers.provider.getLogs([]));
}

main();
