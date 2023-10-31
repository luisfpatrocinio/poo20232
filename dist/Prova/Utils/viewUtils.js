"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepararTelaPostagem = exports.showBlogLogo = exports.mainBackground = exports.exibirTextoEsquerda = exports.exibirTextoNoCentro = exports.limparTerminal = exports.obterAlturaTerminal = exports.obterLarguraTerminal = void 0;
var readline = require('readline');
function obterLarguraTerminal() {
    return process.stdout.columns;
}
exports.obterLarguraTerminal = obterLarguraTerminal;
function obterAlturaTerminal() {
    return process.stdout.rows;
}
exports.obterAlturaTerminal = obterAlturaTerminal;
function limparTerminal() {
    console.clear();
}
exports.limparTerminal = limparTerminal;
function exibirTextoNoCentro(texto) {
    var _x = Math.floor((obterLarguraTerminal() - texto.length) / 2);
    readline.cursorTo(process.stdout, _x);
    console.log(texto);
}
exports.exibirTextoNoCentro = exibirTextoNoCentro;
function exibirTextoEsquerda(texto) {
    readline.cursorTo(process.stdout, 2);
    console.log(texto);
}
exports.exibirTextoEsquerda = exibirTextoEsquerda;
function mainBackground() {
    limparTerminal();
    for (let i = 0; i < obterAlturaTerminal(); i++) {
        if (i == 0)
            console.log(`${"=".repeat(obterLarguraTerminal())}`);
        if (i > 1 && i < obterAlturaTerminal() - 2)
            console.log(`|${" ".repeat(obterLarguraTerminal() - 2)}|`);
        if (i == obterAlturaTerminal() - 1)
            console.log(`${"=".repeat(obterLarguraTerminal())}`);
    }
    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);
}
exports.mainBackground = mainBackground;
function showBlogLogo() {
    exibirTextoNoCentro("__                 __            ");
    exibirTextoNoCentro("|__)  _  |_  _  _  |__) |  _   _  ");
    exibirTextoNoCentro("|    (_| |_ |  (_) |__) | (_) (_) ");
    exibirTextoNoCentro("                              _/  ");
}
exports.showBlogLogo = showBlogLogo;
function prepararTelaPostagem(perfil) {
    mainBackground();
    showBlogLogo();
    exibirTextoNoCentro("~ Criar Postagem ~");
    exibirTextoEsquerda(`Perfil: ${perfil.nome} (${perfil.email})`);
    readline.cursorTo(process.stdout, 2);
}
exports.prepararTelaPostagem = prepararTelaPostagem;
