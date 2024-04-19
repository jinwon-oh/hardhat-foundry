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

  await multisend(signers, addr, "0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be");
}

// TEST
async function testV1(signers, addr) {
  const f = await ethers.getContractFactory("ERC20UpgradeableV1");
  const c = await f.attach(addr);
  let b;
  b = await c.balanceOf(signers[0].address);
  console.log("b0:", b);
  await c.mint(signers[0].address, 3_000_000);
  b = await c.balanceOf(signers[0].address);
  console.log("b0:", b);

  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  await c.mint(signers[1].address, 2_000_001);
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
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

  console.log(
    "balance 0:",
    await ethers.provider.getBalance(signers[0].address)
  );
  const c = await ethers.getContractAt("MultiSendToken", addr);
  await t.approve(addr, 2_500_000);
  console.log("allowance:", await t.allowance(signers[0].address, addr));
  console.log(
    "balance 0:",
    await ethers.provider.getBalance(signers[0].address)
  );
  try {
    b = await c.multiSendToken(
      token,
      [signers[1].address, signers[2].address],
      [1_500_000, 1_000_000]
      // [
      //   115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      //   1000000n,
      // ]
    );
    const { gasUsed, cumulativeGasUsed, logs } =
      await ethers.provider.getTransactionReceipt(b.hash);
    console.log({ gasUsed, cumulativeGasUsed, logs });
  } catch (err) {
    console.error(err);
  }
  // b = await t.transfer(signers[2].address, 1000000);
  // console.log(b);
  // console.log(
  //   "logs:",
  //   await ethers.provider.getLogs([
  //     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  //   ])
  // );
  let l = await ethers.provider.getLogs([]);
  for (let i = 0; i < l.length; i++) {
    const j = l[i].toJSON();
    console.log(
      `multiSendToken logs${i}:`,
      t.interface.decodeEventLog(j.topics[0], j.data, j.topics)
    );
  }
  console.log(
    "balance 0:",
    await ethers.provider.getBalance(signers[0].address)
  );

  b = await t.balanceOf(signers[0].address);
  console.log("b0:", b);
  b = await t.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await t.balanceOf(signers[2].address);
  console.log("b2:", b);
}

main();
