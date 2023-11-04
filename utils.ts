var readline = require("readline");
import { limparTerminal, obterAlturaTerminal, obterLarguraTerminal, exibirTextoEsquerda } from "./Prova/Utils/viewUtils";

import { question } from "readline-sync";

export async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}

export function showCenterText(_txt: string) {
    var _largura = obterLarguraDaTela();
    var _qntEspacos = Math.floor((_largura - _txt.length) / 2);
    _qntEspacos = Math.max(_qntEspacos, 0);
    console.log(`${' '.repeat(_qntEspacos)}${_txt}`);
}

function obterLarguraDaTela() {
    var _colunas = process.stdout.columns;
    return _colunas;
}

function obterAlturaDaTela() {
    var _linhas = process.stdout.rows;
    return _linhas;
}

export function obterTexto(label: string = "") {
    return question(`> ${label}: `);
}

export function obterNumero(label: string = "") {
    let num: number;
    do {
        num = Number(question(`> ${label}: `));
    } while (isNaN(num));
    return num;
}

export function enterToContinue() {
    question("[ENTER]", {mask: ''})
}

export function limparTerminal() {
    console.clear();
}
export function mainBackground(): void {
    limparTerminal();
    const chalk = require('chalk');
    for (let i = 0; i < obterAlturaTerminal(); i++) {
        if (i == 0) console.log(`${"=".repeat(obterLarguraTerminal())}`);
        if (i > 1 && i < obterAlturaTerminal() - 2) console.log(`|${" ".repeat(obterLarguraTerminal() - 2)}|`);
        if (i == obterAlturaTerminal() - 1) console.log(`${"=".repeat(obterLarguraTerminal())}`);
        console.log(chalk.red('texto vermelho'));
    }

    // Rodapé
    readline.cursorTo(process.stdout, 1, obterAlturaTerminal() - 4);
    var _data = new Date;
    var _dataStr = `${_data.toUTCString()}`;
    exibirTextoEsquerda(`${_dataStr}`);


    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);
}
