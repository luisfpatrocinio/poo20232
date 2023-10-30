import { question } from "readline-sync";
import { obterTexto, showCenterText, enterToContinue, limparTerminal, obterNumero } from "../utils";
import { readFileSync } from "fs";

class Calculadora {
    private operando1: number;
    private operando2: number;

    public somar(): number {
        return this.operando1 + this.operando2;
    }

    public multiplicar(): number {
        return this.operando1 * this.operando2
    }

    constructor(operando1: number, operando2: number) {
        this.operando1 = operando1;
        this.operando2 = operando2;
    }
}

function main() {
    showCenterText("PatroCalculadora");
    let num1 = obterNumero("Digite o valor do primeiro operando");
    let num2 = obterNumero("Digite o valor do segundo operando");
    let calc = new Calculadora(Number(num1), Number(num2));

    enterToContinue();
    limparTerminal();

    console.log(`A soma dos dois valores é ${calc.somar()}.`);
    console.log(`A multiplicação dos dois valores é ${calc.multiplicar()}.`);
}

main();