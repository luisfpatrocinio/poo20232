"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainBackground = void 0;
var readline = require('readline');
const viewUtils_1 = require("./viewUtils");
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
