import { ethers } from "hardhat";
import EquipNFT1155 from "../../artifacts/contracts/EquipNFT1155.sol/EquipNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import becomeGroupReceipt from "./becomeGroupReceipt.json";
import equipSingleReceipt from "./equipSingleReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

    const wallet = WalletWithProvider(setEnv);

    const contract = await ethers.getContractAt(EquipNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

    const check  = await contract.GroupToRelationship(becomeGroupReceipt.data, "0x71bE63f3384f5fb98995898A86B02Fb2426c5788");

    let data = JSON.stringify(check);
    
    fs.writeFileSync('./scripts/EquipNFT1155/mappingcheck.json', data);

}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});