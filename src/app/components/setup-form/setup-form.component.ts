import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { AppService } from '../../app.service';

@Component({
  selector: "setup-form",
  templateUrl: "./setup-form.component.html"
})
export class SetupComponent {
  SetupForm: FormGroup;
  accounts: string[] = []
  constructor(
    public appService: AppService,
  ) {
    this.SetupForm = new FormGroup({
      contractAddress: new FormControl(this.appService.contractAddress, Validators.required),
      nodeAddress: new FormControl(this.appService.nodeAddress, Validators.required),
    });
    this.getAccounts();

  }

  save() {
    localStorage.setItem("contractAddress", this.SetupForm.get("contractAddress").value);
    localStorage.setItem("nodeAddress", this.SetupForm.get("nodeAddress").value)
  }
  setSelectedAccount(event) {
    localStorage.setItem("selectedAccount", event);
  }
  getAccounts() {
    this.appService.getAccounts().then(accounts => {
      this.accounts = accounts;
      if (!this.appService.selectedAccount) {
        localStorage.setItem("selectedAccount", this.accounts[0]);
      }
    })

  }
}