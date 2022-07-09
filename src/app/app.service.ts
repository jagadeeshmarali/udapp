import { Injectable } from "@angular/core";
import { ethers } from "ethers";

@Injectable({
  providedIn: "root"
})
export class AppService {
  get nodeAddress() { return localStorage.getItem("nodeAddress"); }
  get selectedAccount() { return localStorage.getItem("selectedAccount"); }
  get contractAddress() { return localStorage.getItem("contractAddress"); }
  provider = new ethers.providers.JsonRpcProvider(this.nodeAddress);
  constructor() { }
  async getAccounts() {
    return this.provider.listAccounts();
  }
}