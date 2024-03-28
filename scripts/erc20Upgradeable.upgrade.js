const { ethers, upgrades } = require("hardhat");

const prevAddr = "0x851356ae760d987E095750cCeb3bC6014560891C"; // "0xC81cBaB47B1e6D6d20d4742721e29f22C5835dcB";

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const ERC20UpgradeableV2 = await ethers.getContractFactory(
    "ERC20UpgradeableV2"
  );
  console.log("Upgrading ERC20UpgradeableV1...");
  await upgrades.upgradeProxy(prevAddr, ERC20UpgradeableV2);
  console.log("Upgraded Successfully");

  await testV2(signers, prevAddr);
}

async function testV2(signers, addr) {
  // TEST
  const f = await ethers.getContractFactory("ERC20UpgradeableV2");
  const c = await f.attach(addr);
  try {
    const r = await c.balanceOf(signers[1].address);
    console.log(r);
  } catch (err) {
    console.error("error:", err);
  }
  try {
    const r = await c.verifyUser(signers[1].address);
    console.log(r);
  } catch (err) {
    console.error("error:", err);
  }
  try {
    await c.mint(signers[1].address, 1_000_000_000_000);
  } catch (err) {
    console.error("error:", err);
  }
  try {
    const r = await c.balanceOf(signers[1].address);
    console.log(r);
  } catch (err) {
    console.error("error:", err);
  }

  try {
    await c.addUser(signers[1].address);
  } catch (err) {
    console.error("error:", err);
  }
  try {
    const r = await c.verifyUser(signers[1].address);
    console.log(r);
  } catch (err) {
    console.error("error:", err);
  }
  try {
    await c.mint(signers[1].address, 1_000_000_000_000);
    const r = await c.balanceOf(signers[1].address);
    console.log(r);
  } catch (err) {
    console.error("error:", err);
  }
}

main();
