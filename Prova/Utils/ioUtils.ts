import { question } from "readline-sync"; 

export function obterNumeroInteiro(mensagem: string): number {
    let numero: number = Number(question(mensagem));
    while (isNaN(numero)) {
        exibirTexto("Número inválido. Tente novamente.");
        numero = Number(question(mensagem));
    }
    return numero;
}

export function exibirTexto(texto: string): void {
    console.log(texto);
}

export function exibirTextoCentralizado(texto: string): void {
    var larguraTerminal: number = obterLarguraTerminal();
    var espacos: number = (larguraTerminal - texto.length) / 2;
    exibirTexto(" ".repeat(espacos) + texto);
}

export function obterLarguraTerminal(): number {
    return process.stdout.columns;
}

export function limparTerminal(): void {
    console.clear();
}

export function enterToContinue(): void {
    question("[ENTER]", {hideEchoBack: true, mask: 'x'});
}