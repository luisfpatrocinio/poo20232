"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showError = exports.showCenterText = exports.showHeader = exports.Stack = void 0;
const visualUtils_1 = require("./visualUtils");
class Stack {
    constructor() {
        this.elements = [];
    }
    push(element) {
        this.elements.push(element);
    }
    pop() {
        return this.elements.pop();
    }
    peek() {
        if (this.elements.length == 0)
            return undefined;
        return this.elements[this.elements.length - 1];
    }
    isEmpty() {
        return this.elements.length == 0;
    }
}
exports.Stack = Stack;
/**
 * Exibe o cabeçalho.
 * @param header - O texto a ser exibido
 */
function showHeader(header) {
    (0, visualUtils_1.clearTerminal)();
    showCenterText(header);
}
exports.showHeader = showHeader;
function showCenterText(text) {
    let width = getTerminalWidth();
    let spaces = width / 2 - text.length / 2;
    console.log(`${" ".repeat(spaces)}${text}`);
}
exports.showCenterText = showCenterText;
function getTerminalHeight() {
    return process.stdout.rows;
}
function getTerminalWidth() {
    return process.stdout.columns;
}
function showError(error) {
    let _totalWidth = getTerminalWidth();
    let _boxWidth = Math.floor(_totalWidth * 8 / 10);
    let _border = (_totalWidth - _boxWidth) / 2;
    console.log(`${" ".repeat(_border)}${".".repeat(_boxWidth)}`);
    showCenterText(error.message);
    showCenterText(`Tipo: ${error.name}`);
    console.log(`${" ".repeat(_border)}${".".repeat(_boxWidth)}`);
}
exports.showError = showError;
