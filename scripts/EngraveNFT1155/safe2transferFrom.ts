import { ethers } from "hardhat";
import EquipNFT1155 from "../../artifacts/contracts/EquipNFT1155.sol/EquipNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

  const wallet = WalletWithProvider(setEnv);

  const contract = await ethers.getContractAt(EquipNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

  let tx = await contract.safeTransferFrom(
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", 
    "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", 
    "0x00", 
    1,
    [0, 1]
    );
  

  let data = JSON.stringify(tx);
  fs.writeFileSync('./scripts/EquipNFT1155/safe2transfer.json', data);

}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});