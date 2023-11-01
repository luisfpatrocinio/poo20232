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

    // Rodapé
    readline.cursorTo(process.stdout, 1, obterAlturaTerminal() - 4);
    var _data = new Date;
    var _dataStr = `${_data.toUTCString()}`;
    exibirTextoEsquerda(`${_dataStr}`);


    // Mover cursor para o início da tela:
    readline.cursorTo(process.stdout, 1, 1);   
}

export function exibirTextoCentroCentro(texto: string): void {
    var _x = Math.floor(obterLarguraTerminal()/2 - texto.length/2)
    var _y = Math.floor(obterAlturaTerminal()/2);
    readline.cursorTo(process.stdout, _x, _y);
}

export function showBlogLogo(): void {
    exibirTextoNoCentro("__                 __            ");
    exibirTextoNoCentro("|__)  _  |_  _  _  |__) |  _   _  ");
    exibirTextoNoCentro("|    (_| |_ |  (_) |__) | (_) (_) ");
    exibirTextoNoCentro("                              _/  ");
}

export function cabecalhoPrincipal(texto: string): void {
    mainBackground();
    showBlogLogo();
    exibirTextoNoCentro(`~ ${texto} ~`);
}

export function prepararTelaPostagem(perfil: Perfil): void {
    cabecalhoPrincipal("Criar Postagem");
    var _header = `Perfil: ${perfil.nome} (${perfil.email})`;
    if (_header.length > obterLarguraTerminal() - 4) {
        _header = `Perfil: ${perfil.nome}`
    }
    exibirTextoEsquerda(_header);
    readline.cursorTo(process.stdout, 2);
}


export function feedView() : void {
    cabecalhoPrincipal("PatroFeed");
}

// @TODO: Rodapé com informações:
// Quantidade de perfis criados
// Quantidade de postagens criadas
// Hashtags, etc
// Curtidas