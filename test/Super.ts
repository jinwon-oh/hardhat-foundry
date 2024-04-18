import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Super", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLs() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const L4 = await hre.ethers.getContractFactory("L4");
    const l4 = await L4.deploy();

    return { l4, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Test A is B", async function () {
      const { l4 } = await loadFixture(deployLs);

      // expect(await l4.suTest(1, 1)).to.equal(102);
    });
  });
});
