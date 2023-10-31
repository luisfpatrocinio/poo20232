"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterToContinue = exports.limparTerminal = exports.obterLarguraTerminal = exports.exibirTextoCentralizado = exports.exibirTexto = exports.obterNumeroInteiro = void 0;
const readline_sync_1 = require("readline-sync");
function obterNumeroInteiro(mensagem) {
    let numero = Number((0, readline_sync_1.question)(mensagem));
    while (isNaN(numero)) {
        exibirTexto("Número inválido. Tente novamente.");
        numero = Number((0, readline_sync_1.question)(mensagem));
    }
    return numero;
}
exports.obterNumeroInteiro = obterNumeroInteiro;
function exibirTexto(texto) {
    console.log(texto);
}
exports.exibirTexto = exibirTexto;
function exibirTextoCentralizado(texto) {
    var larguraTerminal = obterLarguraTerminal();
    var espacos = (larguraTerminal - texto.length) / 2;
    exibirTexto(" ".repeat(espacos) + texto);
}
exports.exibirTextoCentralizado = exibirTextoCentralizado;
function obterLarguraTerminal() {
    return process.stdout.columns;
}
exports.obterLarguraTerminal = obterLarguraTerminal;
function limparTerminal() {
    console.clear();
}
exports.limparTerminal = limparTerminal;
function enterToContinue() {
    (0, readline_sync_1.question)("[ENTER]", { hideEchoBack: true, mask: 'x' });
}
exports.enterToContinue = enterToContinue;
