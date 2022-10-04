import {ethers} from "hardhat";
import {Wallet} from "ethers";


export function WalletWithProvider(setEnv: string): Wallet{
    let privateKey = `${setEnv}_PRIVATE_KEY`
    let url = `${setEnv}_URL`
    const provider = ethers.providers.getDefaultProvider(process.env[url])
    // specific signer 
    return new ethers.Wallet(process.env[privateKey] as string, provider)
}