import { ethers } from "hardhat";
import EngraveNFT1155 from "../../artifacts/contracts/EngraveNFT1155.sol/EngraveNFT1155.json"
import {WalletWithProvider} from "../helper";
import deploymentReceipt from "./deploymentReceipt.json";
import * as fs from "fs"

async function main(setEnv: string) {

  const wallet = WalletWithProvider(setEnv);

  const contract = await ethers.getContractAt(EngraveNFT1155.abi, deploymentReceipt.ContractAddress, wallet)

  let tx = await contract.createPack("APJJ");
  let tx2 = await contract.getOwnerPackIds(wallet.address);
  contract.once("NewGroup", (ev) => {
    console.log(JSON.stringify(ev),
    )
  });

  let data = JSON.stringify(tx);
  fs.writeFileSync('./scripts/EquipNFT1155/becomeGroupReceipt.json', data);

}

main(process.env.SETENV as string).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

