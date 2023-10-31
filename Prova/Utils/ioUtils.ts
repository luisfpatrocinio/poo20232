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