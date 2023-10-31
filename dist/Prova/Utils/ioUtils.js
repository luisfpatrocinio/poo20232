"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterToContinue = exports.exibirTextoCentralizado = exports.exibirTexto = exports.obterNumeroInteiro = void 0;
const readline_sync_1 = require("readline-sync");
const viewUtils_1 = require("./viewUtils");
var readline = require('readline');
function obterNumeroInteiro(mensagem) {
    readline.cursorTo(process.stdout, 2);
    let numero = Number((0, readline_sync_1.question)(mensagem));
    while (isNaN(numero)) {
        exibirTexto("Número inválido. Tente novamente.");
        numero = Number((0, readline_sync_1.question)(mensagem));
    }
    return numero;
}
exports.obterNumeroInteiro = obterNumeroInteiro;
function exibirTexto(texto) {
    readline.cursorTo(process.stdout, 2);
    console.log(texto);
}
exports.exibirTexto = exibirTexto;
function exibirTextoCentralizado(texto) {
    var larguraTerminal = (0, viewUtils_1.obterLarguraTerminal)();
    var espacos = (larguraTerminal - texto.length) / 2;
    exibirTexto(" ".repeat(espacos) + texto);
}
exports.exibirTextoCentralizado = exibirTextoCentralizado;
function enterToContinue() {
    (0, readline_sync_1.question)("[ENTER]", { hideEchoBack: true, mask: 'x' });
}
exports.enterToContinue = enterToContinue;