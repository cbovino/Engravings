import { ethers } from "hardhat";
import EngraveNFT1155 from "../../artifacts/contracts/EngraveNFT1155.sol/EngraveNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

  const wallet = WalletWithProvider(setEnv);

  const contract = await ethers.getContractAt(EngraveNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

  let tx = await contract.engrave("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
  
  contract.once("NewRelationship", (ev) => {
    console.log(JSON.stringify(ev), "this is the events")
  })
  let data = JSON.stringify(tx);
  fs.writeFileSync('./scripts/EngraveNFT1155/engraveReceipt.json', data);

}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});