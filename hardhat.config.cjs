require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" }); // Assuming the user named it .env based on the file content they showed

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    creditcoin_testnet: {
      url: "https://rpc.cc3-testnet.creditcoin.network",
      chainId: 102031,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
