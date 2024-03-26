import { HardhatUserConfig, task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.formatEther(balance), "ETH");
  });

task("timestamp", "Prints a block's timestamp")
  .addOptionalParam("block", "The block number")
  .setAction(async (taskArgs, { ethers }) => {
    const param = isNaN(taskArgs.block) ? "latest" : Number(taskArgs.block);
    const block = await ethers.provider.getBlock(param);

    console.log(
      block?.timestamp == null
        ? "Unkown timestamp"
        : `${block.timestamp}\n${new Date(block.timestamp * 1000)}`
    );
  });

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/<key>",
      accounts: [],
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
      // evmVersion: "shanghai",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;
