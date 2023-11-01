"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedView = exports.prepararTelaPostagem = exports.cabecalhoPrincipal = exports.showBlogLogo = exports.exibirTextoCentroCentro = exports.mainBackground = exports.exibirTextoEsquerda = exports.exibirTextoNoCentro = exports.limparTerminal = exports.obterAlturaTerminal = exports.obterLarguraTerminal = void 0;
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
    // Rodapé
    readline.cursorTo(process.stdout, 1, obterAlturaTerminal() - 4);
    var _data = new Date;
    var _dataStr = `${_data.toUTCString()}`;
    exibirTextoEsquerda(`${_dataStr}`);
    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);
}
exports.mainBackground = mainBackground;
function exibirTextoCentroCentro(texto) {
    var _x = Math.floor(obterLarguraTerminal() / 2 - texto.length / 2);
    var _y = Math.floor(obterAlturaTerminal() / 2);
    readline.cursorTo(process.stdout, _x, _y);
}
exports.exibirTextoCentroCentro = exibirTextoCentroCentro;
function showBlogLogo() {
    exibirTextoNoCentro("__                 __            ");
    exibirTextoNoCentro("|__)  _  |_  _  _  |__) |  _   _  ");
    exibirTextoNoCentro("|    (_| |_ |  (_) |__) | (_) (_) ");
    exibirTextoNoCentro("                              _/  ");
}
exports.showBlogLogo = showBlogLogo;
function cabecalhoPrincipal(texto) {
    mainBackground();
    showBlogLogo();
    exibirTextoNoCentro(`~ ${texto} ~`);
}
exports.cabecalhoPrincipal = cabecalhoPrincipal;
function prepararTelaPostagem(perfil) {
    cabecalhoPrincipal("Criar Postagem");
    var _header = `Perfil: ${perfil.nome} (${perfil.email})`;
    if (_header.length > obterLarguraTerminal() - 4) {
        _header = `Perfil: ${perfil.nome}`;
    }
    exibirTextoEsquerda(_header);
    readline.cursorTo(process.stdout, 2);
}
exports.prepararTelaPostagem = prepararTelaPostagem;
function feedView() {
    cabecalhoPrincipal("PatroFeed");
}
exports.feedView = feedView;
// @TODO: Rodapé com informações:
// Quantidade de perfis criados
// Quantidade de postagens criadas
// Hashtags, etc
// Curtidas
