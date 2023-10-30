"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Calculadora {
    somar() {
        return this.operando1 + this.operando2;
    }
    multiplicar() {
        return this.operando1 * this.operando2;
    }
    constructor(operando1, operando2) {
        this.operando1 = operando1;
        this.operando2 = operando2;
    }
}
function main() {
    (0, utils_1.showCenterText)("PatroCalculadora");
    let num1 = (0, utils_1.obterNumero)("Digite o valor do primeiro operando");
    let num2 = (0, utils_1.obterNumero)("Digite o valor do segundo operando");
    let calc = new Calculadora(Number(num1), Number(num2));
    (0, utils_1.enterToContinue)();
    (0, utils_1.limparTerminal)();
    console.log(`A soma dos dois valores é ${calc.somar()}.`);
    console.log(`A multiplicação dos dois valores é ${calc.multiplicar()}.`);
}
main();
