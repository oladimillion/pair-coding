export function formatTime(time){

  let str = time

  if(str.indexOf(",") == -1){
    let b = str.split(" ")
    str = [b[0], ", ", b[1], " " + b[2]].join("")
  }

  return str;
}

export class JsInterpreter
{
  
  constructor(){
    this.data = undefined;
  }

  assignData(data){
    this.data = data;
  }

  removeComment(){
    return this.data.replace(/\/\/.*|\/\*.*\*\//g, "");
  }

  addConsoleFunctionality(){

    let newData = `const __initObject__ = {}; ${this.removeComment(this.data)}  \n__initObject__;`;
    const test = /(console.log\(|log\()/gim;
    let re = /(console.log\(.*\)|log\(.*\))/;
    let re2 = /\(.*\)/

    let index = 0;
    newData = newData.replace(test, "\nconsole.log(");

    while(test.test(newData))
    {
      /*
       * cycle till all occurrence of console.log 
       * replaced with __initObject__
      */
      // get console.log and content between parentensis
      let consoleAndContent = re.exec(newData)[0];
      // extract content and parentensis
      let expression = re2.exec(consoleAndContent)[0];
      // remove parentensis
      expression = expression.substring(1, expression.length - 1);
      // replace "" with _____
      expression = expression == "" ? "'____'" : expression;
      // assign key - value to __initObject__
      expression =  "\n__initObject__[" + index + "] = " + expression;
      // replace all occurrence of console.log and its content with
      // "expression"
      newData = newData.replace(re, expression)

      index++;
    }
    return newData;
  }

  run(){
    try{
      let _data = this.addConsoleFunctionality(this.data);
      let result = eval(_data);

      result = [...Object.values(result || {})
        .map(value => value === undefined ? "undefined" : value)];

      return !result.length ? ["undefined"] : result;
    } catch(err) {
      return [err.toString()];
    }
  }
}

