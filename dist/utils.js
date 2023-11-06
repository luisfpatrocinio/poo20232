"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limparTerminal = exports.enterToContinue = exports.obterNumero = exports.obterTexto = exports.showCenterText = exports.sleep = void 0;
const readline_sync_1 = require("readline-sync");
async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}
exports.sleep = sleep;
function showCenterText(_txt) {
    var _largura = obterLarguraDaTela();
    var _qntEspacos = Math.floor((_largura - _txt.length) / 2);
    _qntEspacos = Math.max(_qntEspacos, 0);
    console.log(`${' '.repeat(_qntEspacos)}${_txt}`);
}
exports.showCenterText = showCenterText;
function obterLarguraDaTela() {
    var _colunas = process.stdout.columns;
    return _colunas;
}
function obterAlturaDaTela() {
    var _linhas = process.stdout.rows;
    return _linhas;
}
function obterTexto(label = "") {
    return (0, readline_sync_1.question)(`> ${label}: `);
}
exports.obterTexto = obterTexto;
function obterNumero(label = "") {
    let num;
    do {
        num = Number((0, readline_sync_1.question)(`> ${label}: `));
    } while (isNaN(num));
    return num;
}
exports.obterNumero = obterNumero;
function enterToContinue() {
    (0, readline_sync_1.question)("[ENTER]", { mask: '' });
}
exports.enterToContinue = enterToContinue;
function limparTerminal() {
    console.clear();
}
exports.limparTerminal = limparTerminal;
