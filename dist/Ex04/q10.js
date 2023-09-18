"use strict";
// Criar classe Jogador
// Propriedades: força, nível e pontos de vida
// Métodos: 
//  calcularAtaque: multiplicação da força pelo nível. é o dano de ataque do jogador
//  atacar: recebe como parâmetro um jogador, e diminui seus pontos de vida em um valor igual ao resultado do método calcularAtaque do jogador atacante.
//  estaVivo: retorna true se o jogador ainda tem pontos de vida.
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterToContinue = exports.obterTexto = void 0;
const readline_sync_1 = require("readline-sync");
class Jogador {
    constructor(forca, nivel, pontosDeVida) {
        this.experiencia = 0;
        this.forca = forca;
        this.nivel = nivel;
        this.pontosDeVida = pontosDeVida;
        this.pontosDeVidaMax = 100;
        this.experiencia = 25 + Math.floor(Math.random() * 5 * this.nivel);
    }
    calcularAtaque() {
        return this.forca * this.nivel;
    }
    atacar(jogador) {
        if (!jogador.estaVivo())
            return;
        let _damage = this.calcularAtaque();
        jogador.pontosDeVida -= _damage;
    }
    estaVivo() {
        return this.pontosDeVida > 0;
    }
    toString() {
        return `Força: ${this.forca}, Nível: ${this.nivel}`;
    }
    showHP() {
        const fillChar = "█";
        const emptyChar = "░";
        const _w = this.pontosDeVidaMax / 5;
        let hpString = "";
        for (let i = 0; i < _w; i++) {
            hpString += (this.pontosDeVida / this.pontosDeVidaMax > i / _w) ? fillChar : emptyChar;
        }
        showCenterText(`HP: ${this.pontosDeVida}/${this.pontosDeVidaMax} [${hpString}]`);
    }
    checarExp() {
        if (this.experiencia >= 100) {
            this.nivel++;
            this.experiencia -= 100;
            return true;
        }
        return false;
    }
}
async function main() {
    limparTerminal();
    showGameLogo();
    // Esperar 3 segundos para mostrar o resto:
    await sleep(3000);
    // Jogo Iniciado:
    limparTerminal();
    showCenterText('= PATROBATALHA =');
    await mostrar_mensagem("Seja bem vindo ao campo de batalha. Digite seu nome: ");
    let nome = await obterTexto();
    while (nome.length <= 0) {
        nome = await obterTexto();
    }
    await mostrar_mensagem(`Olá ${nome}, vamos gerar o seu personagem...`);
    enterToContinue();
    // Esperar 1 segundo para mostrar o resto:
    await flashScreen();
    let jogador = criarJogadorAleatorio();
    jogador.pontosDeVida = 100;
    jogador.nivel = 1;
    jogador.experiencia = 0;
    let inimigosDerrotados = 0;
    showBattleMessage("Aperte ENTER para iniciar a batalha.\n", nome, jogador);
    while (jogador.estaVivo()) {
        showBattleInterface(nome, jogador);
        await mostrar_mensagem("Um inimigo aleatório surge!");
        let inimigo = criarJogadorAleatorio();
        inimigo.pontosDeVidaMax = 20 + Math.floor(Math.random() * 30);
        inimigo.pontosDeVida = inimigo.pontosDeVidaMax;
        inimigo.nivel = Math.min(inimigo.nivel, jogador.nivel);
        console.log(inimigo.toString());
        await sleep(2000);
        let turno = 0;
        while (inimigo.estaVivo() && jogador.estaVivo()) {
            turno++;
            showBattleMessage(`Iniciando turno ${turno}.`, nome, jogador, inimigo);
            showBattleMessage("Você ataca!", nome, jogador, inimigo);
            jogador.atacar(inimigo);
            showBattleMessage("Dano causado: " + String(jogador.calcularAtaque()), nome, jogador, inimigo);
            if (inimigo.estaVivo()) {
                showBattleMessage("O inimigo te ataca!", nome, jogador, inimigo);
                await flashScreen();
                showBattleInterface(nome, jogador, inimigo);
                inimigo.atacar(jogador);
                showBattleMessage("Dano recebido: " + String(inimigo.calcularAtaque()), nome, jogador, inimigo);
            }
            else {
                inimigosDerrotados++;
                showBattleMessage("Você derrotou o inimigo!", nome, jogador, inimigo);
                let _expGained = inimigo.experiencia;
                jogador.experiencia += _expGained;
                showBattleMessage(`Você recebeu ${_expGained} pontos de experiência!`, nome, jogador, inimigo);
                while (jogador.experiencia >= 100) {
                    if (jogador.checarExp()) {
                        showBattleMessage(`Você subiu para o nível ${jogador.nivel}!`, nome, jogador, inimigo);
                    }
                }
            }
        }
    }
    await mostrar_mensagem(`Seus dias de glória acabaram, ${nome}!\nVocê derrotou ${inimigosDerrotados} inimigos!`);
    enterToContinue();
}
async function showBattleMessage(text, nome, jogador, inimigo) {
    showBattleInterface(nome, jogador, inimigo);
    skipLines(1);
    console.log(`>> ${text}`);
    enterToContinue();
}
function showBattleInterface(nome, jogador, inimigo) {
    limparTerminal();
    showCenterText(`${nome} - ${jogador.toString()}`);
    jogador.showHP();
    if (jogador.experiencia > 0)
        showCenterText(jogador.experiencia + " exp.");
    else
        skipLines(1);
    if (inimigo == undefined)
        return;
    skipLines(1);
    showCenterText(`Inimigo - ${inimigo.toString()}`);
    inimigo.showHP();
}
function skipLines(_n) {
    for (let i = 0; i < _n; i++) {
        console.log();
    }
}
async function flashScreen() {
    limparTerminal();
    let _largura = obterLarguraDaTela();
    for (let i = 0; i < obterAlturaDaTela(); i++) {
        console.log(`${'█'.repeat(_largura)}`);
    }
    process.stdout.write("\x1b[A\r");
    await sleep(168);
    limparTerminal();
}
async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}
function showGameLogo() {
    skipLines(Math.floor(obterAlturaDaTela() / 2) - 1);
    showCenterText('= PATROBATALHA =');
    showCenterText('v0.1');
}
function showCenterText(_txt) {
    var _largura = obterLarguraDaTela();
    var _qntEspacos = Math.floor((_largura - _txt.length) / 2);
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
function enterParaContinuar() {
    process.stdin.once("data", function () {
        limparTerminal();
    });
}
function limparTerminal() {
    console.clear();
}
function mostrar_mensagem(_mensagem) {
    let msg = `\nPATROBOT: ${_mensagem}`;
    let intervalo = 2;
    return new Promise(resolve => {
        let i = 0;
        function exibirProximoCaractere() {
            if (i < msg.length) {
                process.stdout.write(msg.charAt(i));
                i++;
                setTimeout(exibirProximoCaractere, intervalo);
            }
            else {
                console.log();
                resolve(void 0);
            }
        }
        exibirProximoCaractere();
    });
}
function criarJogadorAleatorio() {
    var _forca = Math.floor(Math.random() * 10) + 1;
    var _nivel = Math.floor(Math.random() * 10) + 1;
    var _pontosDeVida = Math.floor(Math.random() * 100) + 1;
    return new Jogador(_forca, _nivel, _pontosDeVida);
}
function obterTexto(label = "") {
    return (0, readline_sync_1.question)(`> ${label}: `);
}
exports.obterTexto = obterTexto;
function enterToContinue() {
    (0, readline_sync_1.question)("[ENTER]", { mask: '' });
}
exports.enterToContinue = enterToContinue;
main();
