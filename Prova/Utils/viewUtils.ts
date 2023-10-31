var readline = require('readline');
import { Perfil } from "../Classes/perfil";

export function obterLarguraTerminal(): number {
    return process.stdout.columns;
}

export function obterAlturaTerminal(): number {
    return process.stdout.rows;
}

export function limparTerminal(): void {
    console.clear();
}

export function exibirTextoNoCentro(texto: string): void {
    var _x = Math.floor((obterLarguraTerminal() - texto.length) / 2);
    readline.cursorTo(process.stdout, _x);
    console.log(texto);
}

export function exibirTextoEsquerda(texto: string): void {
    readline.cursorTo(process.stdout, 2);
    console.log(texto);
}

export function mainBackground(): void{
    limparTerminal();
    for (let i = 0; i < obterAlturaTerminal(); i++) {
        if (i == 0) console.log(`${"=".repeat(obterLarguraTerminal())}`);
        if (i > 1 && i < obterAlturaTerminal() - 2) console.log(`|${" ".repeat(obterLarguraTerminal() - 2)}|`);
        if (i == obterAlturaTerminal() - 1) console.log(`${"=".repeat(obterLarguraTerminal())}`);
    }
    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);
    
}

export function showBlogLogo(): void {
    exibirTextoNoCentro("__                 __            ");
    exibirTextoNoCentro("|__)  _  |_  _  _  |__) |  _   _  ");
    exibirTextoNoCentro("|    (_| |_ |  (_) |__) | (_) (_) ");
    exibirTextoNoCentro("                              _/  ");
}

export function prepararTelaPostagem(perfil: Perfil): void {
    mainBackground();
    showBlogLogo();
    exibirTextoNoCentro("~ Criar Postagem ~");

    exibirTextoEsquerda(`Perfil: ${perfil.nome} (${perfil.email})`);
    readline.cursorTo(process.stdout, 2);
}