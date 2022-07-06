import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ethers } from "ethers";
import { AppService } from "../../app.service";
import { abi } from "../../abi";
import { parse, prepareFunction } from "../../utils";

@Component({
  selector: "abi-encoder",
  templateUrl: "abi-encoder.component.html",
})
export class ABIEncoderComponent {
  AbiForm: FormGroup
  parsedFunctions
  constructor(
    private fb: FormBuilder,
    public appService: AppService
  ) {
    this.AbiForm = this.fb.group({
      func: this.fb.array([])
    });
    this.parsedFunctions = parse(JSON.stringify(abi.abi));

  }
  ngOnInit() {
    let i = 0;
    for (let key in this.parsedFunctions) {
      let t = prepareFunction(this.parsedFunctions[key]);
      this.addFunction(key)
      t["inputs"].forEach(ele => {
        this.addfunctionArg(i, ele.name, ele.type)
      })

      console.log(key, t);
      i++;
    }

  }

  functions(): FormArray {
    return this.AbiForm.get("func") as FormArray
  }
  newFunction(name): FormGroup {
    return this.fb.group({
      function: name,
      arguments: this.fb.array([])
    });
  }
  addFunction(name) {
    this.functions().push(this.newFunction(name));
  }
  newArgument(arg, type): FormGroup {
    return this.fb.group({
      arg: new FormControl(arg),
      value: new FormControl("", Validators.required),
    });
  }
  functionArgs(index: number): FormArray {
    return this.functions().at(index).get("arguments") as FormArray;
  }
  addfunctionArg(index: number, arg, type) {
    this.functionArgs(index).push(this.newArgument(arg, type));
  }

  constructfunc(index) {
    let val = this.functions().at(index).value;
    let a = this.functions().at(index).value.arguments.map((x) => x.value);
    let name = val.function;
    let signer = this.appService.provider.getSigner(this.appService.selectedAccount);
    let contract = new ethers.Contract(this.appService.contractAddress, abi.abi, signer);
    contract.functions[name](...a).then(k => console.log(k))
  }
}