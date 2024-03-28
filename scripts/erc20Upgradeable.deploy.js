const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const ERC20UpgradeableV1 = await ethers.getContractFactory(
    "ERC20UpgradeableV1"
  );
  console.log("Deploying ERC20UpgradeableV1...");
  const contract = await upgrades.deployProxy(
    ERC20UpgradeableV1,
    [signers[0].address],
    {
      initializer: "initialize",
      kind: "transparent",
    }
  );
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("ERC20UpgradeableV1 deployed to:", addr);

  await testV1(signers, addr);
}

async function testV1(signers, addr) {
  // TEST
  const f = await ethers.getContractFactory("ERC20UpgradeableV1");
  const c = await f.attach(addr);
  let b = await c.balanceOf(signers[1].address);
  console.log(b);
  await c.mint(signers[1].address, 1_000_000_000_000);
  b = await c.balanceOf(signers[1].address);
  console.log(b);
}

main();
