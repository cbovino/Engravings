import { ethers } from "hardhat";
import {utils} from "ethers"
import EngraveNFT1155 from "../../artifacts/contracts/EngraveNFT1155.sol/EngraveNFT1155.json"
import {WalletWithProvider} from "../helper";
import * as fs from "fs"

async function main(setEnv: string) {
  const wallet = WalletWithProvider(setEnv);
  const NFT = new ethers.ContractFactory(EngraveNFT1155.abi, EngraveNFT1155.bytecode, wallet)
  // The gas price (in wei)...
  const gasPrice = await wallet.getGasPrice()
  // { BigNumber: "23610503242" }

  // ...often this gas price is easier to understand or
  // display to the user in gwei
  const converted = utils.formatUnits(gasPrice, "gwei")

// '23.610503242'
  const nft = await NFT.deploy();
  //wait until the transaction is mind
  const minedTransaction = await nft.deployTransaction.wait()
  const deploymentReceipt = {
    ContractAddress: nft.address,
    SignerAddress: minedTransaction.from,
    GasUsed: minedTransaction.gasUsed,
    transaction:  minedTransaction.blockHash
  }
  let data = JSON.stringify(deploymentReceipt);
  fs.writeFileSync('./savedReceipts/deploymentReceiptGanache.json', data);
}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});