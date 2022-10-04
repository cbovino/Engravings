import { ethers } from "hardhat";
import EquipNFT1155 from "../../artifacts/contracts/EngraveNFT1155.sol/EngraveNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import becomeGroupReceipt from "./becomeGroupReceipt.json";
import equipSingleReceipt from "./equipSingleReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

    const wallet = WalletWithProvider(setEnv);

    const contract = await ethers.getContractAt(EquipNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

    const uri = await contract.uri(0);

    // let data = JSON.stringify(check);
    
    // fs.writeFileSync('./scripts/EquipNFT1155/mappingcheck.json', data);

}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});