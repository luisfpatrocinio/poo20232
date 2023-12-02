"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterToContinue = exports.getNumber = exports.getText = void 0;
const exceptions_1 = require("../Exceptions/exceptions");
const readline_sync_1 = require("readline-sync");
function getText(msg) {
    // Validar texto:
    // - Não pode ser vazio
    // - Não pode conter caracteres especiais
    let _text = (0, readline_sync_1.question)(msg);
    if (_text.trim().length <= 0) {
        throw new exceptions_1.AppError("O texto não pode ser vazio.");
    }
    return _text;
}
exports.getText = getText;
function getNumber(msg) {
    // Validar texto:
    // - Não pode ser vazio
    // - Não pode conter texto
    let _text = (0, readline_sync_1.question)(msg);
    if (_text.trim().length <= 0) {
        throw new exceptions_1.AppError("O texto não pode ser vazio.");
    }
    let _number = Number(_text);
    return _number;
}
exports.getNumber = getNumber;
function enterToContinue() {
    var readline = require('readline');
    var _text = "[C/Espaço - Continuar]";
    var _x = Math.floor(getTerminalWidth() / 2 - _text.length / 2);
    readline.cursorTo(process.stdout, _x);
    // console.log(chalk.bgHex(obterCorDoFundo())(_text));
    console.log(_text);
    (0, readline_sync_1.keyInPause)('', { mask: '', limit: 'c ' });
}
exports.enterToContinue = enterToContinue;
function getTerminalWidth() {
    return process.stdout.columns;
}
