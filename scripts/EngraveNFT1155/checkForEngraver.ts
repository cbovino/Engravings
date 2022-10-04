import { ethers } from "hardhat";
import EngraveNFT1155 from "../../artifacts/contracts/EngraveNFT1155.sol/EngraveNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

  const wallet = WalletWithProvider(setEnv);

  const contract = await ethers.getContractAt(EngraveNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

  let tx = await contract.packs("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

  let data = JSON.stringify(tx);
  fs.writeFileSync('./scripts/EquipNFT1155/checkpacks.json', data);
}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});