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

  // await multisend(signers, addr, "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8");
}

// TEST
async function testV1(signers, addr) {
  const f = await ethers.getContractFactory("ERC20UpgradeableV1");
  const c = await f.attach(addr);
  let b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  await c.mint(signers[1].address, 1_000_000_000_000);
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);

  b = await c.balanceOf(signers[0].address);
  console.log("b0:", b);
  await c.mint(signers[0].address, 1_000_000_000_001);
  b = await c.balanceOf(signers[0].address);
  console.log("b0:", b);
}

async function multisend(signers, token, addr) {
  const f = await ethers.getContractFactory("ERC20UpgradeableV1");
  const t = await f.attach(token);

  let b = await t.balanceOf(signers[0].address);
  console.log("b0:", b);
  b = await t.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await t.balanceOf(signers[2].address);
  console.log("b2:", b);

  console.log("balance:", await ethers.provider.getBalance(signers[0].address));
  const c = await ethers.getContractAt("MultiSendToken", addr);
  await t.approve(addr, 3_000_000);
  console.log("balance:", await ethers.provider.getBalance(signers[0].address));
  b = await c.multiSendToken(
    token,
    [signers[1].address, signers[2].address],
    [1_000_000, 2_000_000]
  );
  // b = await t.transfer(signers[2].address, 1000000);
  // console.log(b);
  console.log(
    "logs:",
    await ethers.provider.getLogs([
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ])
  );
  console.log("balance:", await ethers.provider.getBalance(signers[0].address));

  b = await t.balanceOf(signers[0].address);
  console.log("b0:", b);
  b = await t.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await t.balanceOf(signers[2].address);
  console.log("b2:", b);
}

main();
