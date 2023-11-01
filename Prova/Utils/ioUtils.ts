import { question } from "readline-sync"; 
import { obterLarguraTerminal } from "./viewUtils";
var readline = require('readline');

export function obterNumeroInteiro(mensagem: string): number {
    readline.cursorTo(process.stdout, 2);
    let numero: number = Number(question(mensagem));
    while (isNaN(numero)) {
        exibirTexto("Número inválido. Tente novamente.");
        numero = Number(question(mensagem));
    }
    return numero;
}

export function exibirTexto(texto: string): void {
    readline.cursorTo(process.stdout, 2);
    console.log(texto);
}

export function exibirTextoCentralizado(texto: string): void {
    var larguraTerminal: number = obterLarguraTerminal() - 2;
    var espacos: number = Math.floor((larguraTerminal - texto.length) / 2);
    exibirTexto(" ".repeat(espacos) + texto);
}

export function enterToContinue(): void {
    var _x = Math.floor(obterLarguraTerminal()/2 - "[ENTER]".length/2);
    readline.cursorTo(process.stdout, _x);
    question("[ENTER]", {hideEchoBack: true, mask: 'x'});
}

export function obterTexto(texto: string): string {
    readline.cursorTo(process.stdout, 2);
    return question(texto)
}