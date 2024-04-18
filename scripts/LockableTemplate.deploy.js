const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const LockableTemplateV1 = await ethers.getContractFactory(
    "LockableTemplateV1"
  );
  console.log("Deploying LockableTemplateV1...");
  const contract = await upgrades.deployProxy(
    LockableTemplateV1,
    ["LockableTemplate", "LKT", signers[0].address, 365 * 24 * 60 * 60],
    {
      initializer: "initialize",
      kind: "transparent",
    }
  );
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("LockableTemplateV1 deployed to:", addr);

  await test(signers, addr);
}

async function test(signers, addr) {
  // TEST
  const f = await ethers.getContractFactory("LockableTemplateV1");
  const c = await f.attach(addr);
  let b = await c.name();
  console.log("name:", b);
  b = await c.symbol();
  console.log("symbol:", b);
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await c.totalSupply();
  console.log("total:", b);

  let r = await c.mint(signers[1].address, 1_000_000_000_000);
  console.log(
    "logs:",
    await ethers.provider.getLogs([
      // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ])
  );
  r = await c.mint(signers[3].address, 1_000_000_000_003);
  console.log(
    "logs:",
    await ethers.provider.getLogs([
      // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ])
  );

  b = await c.totalSupply();
  console.log("total:", b);
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await c.balanceOf(signers[3].address);
  console.log("b3:", b);
  b = await c.balanceOf(signers[2].address);
  console.log("b2:", b);

  const data = await c.interface.encodeFunctionData("transfer", [
    signers[2].address,
    1_000_000_000,
  ]);
  await signers[1].sendTransaction({ data: data, to: c.getAddress() });
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await c.balanceOf(signers[2].address);
  console.log("b2:", b);
}

main();
