const { ethers, upgrades } = require("hardhat");

const prevAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const signers = await ethers.getSigners();
  console.log(signers.map((s) => s.address));

  const LockableTemplateV2 = await ethers.getContractFactory(
    "LockableTemplateV2"
  );
  console.log("Upgrading LockableTemplateV2...");
  // const contract = await upgrades.deployProxy(
  //   LockableTemplateV2,
  //   ["LockableTemplate", "LKT", signers[0].address, 365 * 24 * 60 * 60],
  //   {
  //     initializer: "initialize",
  //     kind: "transparent",
  //   }
  // );
  const contract = await upgrades.upgradeProxy(prevAddr, LockableTemplateV2);
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("LockableTemplateV2 upgraded:", addr);

  await test(signers, addr);
}

async function test(signers, addr) {
  // TEST
  const f = await ethers.getContractFactory("LockableTemplateV2");
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
  let l = await ethers.provider.getLogs([]);
  for (let i = 0; i < l.length; i++) {
    const j = l[i].toJSON();
    console.log(
      `mint to signers[1] logs${i}:`,
      c.interface.decodeEventLog(j.topics[0], j.data, j.topics)
    );
  }
  r = await c.mint(signers[4].address, 1_000_000_000_004);
  l = await ethers.provider.getLogs([]);
  for (let i = 0; i < l.length; i++) {
    const j = l[i].toJSON();
    console.log(
      `mint to signers[4] logs${i}:`,
      c.interface.decodeEventLog(j.topics[0], j.data, j.topics)
    );
  }

  b = await c.totalSupply();
  console.log("total:", b);
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await c.balanceOf(signers[3].address);
  console.log("b3:", b);
  b = await c.balanceOf(signers[4].address);
  console.log("b4:", b);
  b = await c.balanceOf(signers[2].address);
  console.log("b2:", b);

  let data = await c.interface.encodeFunctionData("transfer", [
    signers[2].address,
    1_000_000_000,
  ]);
  await signers[1].sendTransaction({ data: data, to: c.getAddress() });
  b = await c.balanceOf(signers[1].address);
  console.log("b1:", b);
  b = await c.balanceOf(signers[2].address);
  console.log("b2:", b);

  data = await c.interface.encodeFunctionData("display", []);
  b = await signers[1].call({ data: data, to: c.getAddress() });
  b = c.interface.decodeFunctionResult("display", b);
  console.log("display:", b);
}

main();
