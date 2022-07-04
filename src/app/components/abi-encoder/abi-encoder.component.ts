import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ethers } from "ethers";
import { abi } from "../../abi";
import { parse, prepareFunction } from "../../utils";

@Component({
  selector: "abi-encoder",
  templateUrl: "abi-encoder.component.html",
})
export class ABIEncoderComponent {
  AbiForm: FormGroup
  parsedFunctions
  constructor(private fb: FormBuilder) {
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
  call(index) {
    console.log(this.functions().at(index).value);
    console.log(this.constructfunc(index))
  }
  constructfunc(index) {
    let val = this.functions().at(index).value;
    let a = this.functions().at(index).value.arguments.map((x) => x.value);
    let name = val.function;
    var url = 'http://localhost:8545';
    var customProvider = new ethers.providers.JsonRpcProvider(url);
    let accounts = []
    customProvider.listAccounts().then((data) => {

      for (let acc of data) {
        // console.log(acc)
        customProvider.getBalance(acc).then((d) => console.log(Number(parseFloat(ethers.utils.formatEther(d)).toFixed(3))));


      }
      let signer = customProvider.getSigner(data[0]);
      let contract = new ethers.Contract("0x3a13fd28bd8df5d3c1d6b6b76b558b496f2df14f", abi.abi, signer);
      // contract.functions.setGreeting("Hi ").then(p => { console.log(p) })
      // contract.functions.greet().then(k => console.log(k))
      contract.functions[name](...a).then(k => console.log(k))
    });




    return null

    // return val.function + "(" + val.arguments[0].value + ")" as Function
  }
}