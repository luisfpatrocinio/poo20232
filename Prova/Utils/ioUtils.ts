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
    var larguraTerminal: number = obterLarguraTerminal();
    var espacos: number = (larguraTerminal - texto.length) / 2;
    exibirTexto(" ".repeat(espacos) + texto);
}

export function enterToContinue(): void {
    question("[ENTER]", {hideEchoBack: true, mask: 'x'});
}