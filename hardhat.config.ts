import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'
const { GOERLI_HTTPS, GOERLI_PRIVATE_KEY } = process.env;


const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    }
    // goerli: {
    //   url: GOERLI_HTTPS,
    //   accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    // }
  }
};


export default config;
