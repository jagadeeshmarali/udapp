import { Injectable } from "@angular/core";
import { ethers } from "ethers";

@Injectable({
  providedIn: "root"
})
export class AppService {
  contractAddress: string = localStorage.getItem("contractAddress");
  nodeAddress: string = localStorage.getItem("nodeAddress");
  selectedAccount = localStorage.getItem("selectedAccount");
  provider = new ethers.providers.JsonRpcProvider(this.nodeAddress);
  constructor() { }
  async getAccounts() {
    return this.provider.listAccounts();
  }
}