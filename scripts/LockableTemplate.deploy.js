const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const LockableTemplate = await ethers.getContractFactory("LockableTemplate");
  console.log("Deploying LockableTemplate...");
  const contract = await upgrades.deployProxy(
    LockableTemplate,
    ["LockableTemplate", "LKT", 365 * 24 * 60 * 60],
    {
      initializer: "initialize",
      kind: "transparent",
    }
  );
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("LockableTemplate deployed to:", addr);

  await test(signers, addr);
}

async function test(signers, addr) {
  // TEST
  // const f = await ethers.getContractFactory("LockableTemplate");
  // const c = await f.attach(addr);
  // let b = await c.balanceOf(signers[1].address);
  // console.log(b);
  // await c.mint(signers[1].address, 1_000_000_000_000);
  // b = await c.balanceOf(signers[1].address);
  // console.log(b);
}

main();
