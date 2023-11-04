"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainBackground = exports.limparTerminal = exports.enterToContinue = exports.obterNumero = exports.obterTexto = exports.showCenterText = exports.sleep = void 0;
var readline = require("readline");
const viewUtils_1 = require("./Prova/Utils/viewUtils");
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
function mainBackground() {
    (0, viewUtils_1.limparTerminal)();
    const chalk = require('chalk');
    for (let i = 0; i < (0, viewUtils_1.obterAlturaTerminal)(); i++) {
        if (i == 0)
            console.log(`${"=".repeat((0, viewUtils_1.obterLarguraTerminal)())}`);
        if (i > 1 && i < (0, viewUtils_1.obterAlturaTerminal)() - 2)
            console.log(`|${" ".repeat((0, viewUtils_1.obterLarguraTerminal)() - 2)}|`);
        if (i == (0, viewUtils_1.obterAlturaTerminal)() - 1)
            console.log(`${"=".repeat((0, viewUtils_1.obterLarguraTerminal)())}`);
        console.log(chalk.red('texto vermelho'));
    }
    // Rodapé
    readline.cursorTo(process.stdout, 1, (0, viewUtils_1.obterAlturaTerminal)() - 4);
    var _data = new Date;
    var _dataStr = `${_data.toUTCString()}`;
    (0, viewUtils_1.exibirTextoEsquerda)(`${_dataStr}`);
    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);
}
exports.mainBackground = mainBackground;
