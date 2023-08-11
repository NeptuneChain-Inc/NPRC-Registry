import { ethers } from "ethers";
import { contractAddress, contractABI, mumbaiRPC, privateKey } from "./ref";

export const provider = new ethers.providers.JsonRpcProvider(mumbaiRPC);
export const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

//SignedTransactions
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet.connect(provider);
export const sContract = new ethers.Contract(contractAddress, contractABI, signer);