"use strict";
/*
2. Crie uma implementação que simule um migroblog:
a. Crie uma classe Postagem e nela:
    a. Crie os atributos:
        1. id do tipo number, representando o identificador da postagem;
        2. texto do tipo string, representando um texto da postagem;
        3. quantidadeCurtidas do tipo number;
    b. Crie um método chamado curtir que incrementa a quantidade curtidas;
    c. Crie um método chamado toString que retorna a concatenação da postagem com a quantidade de curtidas;
b. Crie uma classe Microblog e nela:
    a. Crie um array de classes Postagem;
    b. Crie um método que inclua uma postagem passada como parâmetro no array de postagens;
    c. Crie um método de excluir uma postagem que recebe um id passado por parâmetro.
        Para isso, efetue uma busca pelo id nas postagens do array e faça a exclusão de forma análoga à feita na classe Banco;
    d. Crie um método que retorna a postagem mais curtida;
    e. Crie um método curtir em que se passa um id como parâmetro e a classe microblog pesquisa a postagem e chama seu método curtir da própria postagem;
    f. Crie um método toString que retorna a concatenação do “toString” de todas as postagens.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = require("readline-sync");
const utils_1 = require("./utils");
const fs_1 = require("fs");
class Postagem {
    curtir() {
        this.likes++;
    }
    toString() {
        return this.texto + " - likes: " + String(this.likes);
    }
    constructor(_texto = "") {
        this.id = 0;
        this.likes = 0;
        this.texto = _texto;
    }
}
class Microblog {
    inserirPostagem(postagem) {
        let novaPostagem = postagem;
        novaPostagem.id = this.postagens.length;
        novaPostagem.likes = 0;
        this.postagens.push(novaPostagem);
    }
    // Percorre as postagens e retorna sua posição no array postagens.
    consultarPorIndice(id) {
        let indiceEncontrado = -1;
        for (let i = 0; i < this.postagens.length; i++) {
            if (this.postagens[i].id == id) {
                indiceEncontrado = i;
                break;
            }
        }
        return indiceEncontrado;
    }
    excluirPostagem(id) {
        // Percorrer as postagens e encontrar a do ID desejado.
        let indiceDesejado = this.consultarPorIndice(id);
        // Se a postagem desejada existir:
        if (indiceDesejado != -1) {
            for (let i = indiceDesejado; i < this.postagens.length - 1; i++) {
                this.postagens[i] = this.postagens[i + 1];
            }
            this.postagens.pop();
            return true;
        }
        return false;
    }
    obterPostagemMaisCurtida() {
        let mostLikes = -1;
        let indiceMostLiked = -1;
        // Percorrer todas as postagens
        for (let i = 0; i < this.postagens.length; i++) {
            if (this.postagens[i].likes > mostLikes) {
                // Eu sou a postagem mais curtida
                mostLikes = this.postagens[i].likes;
                indiceMostLiked = i;
            }
        }
        // Obs: Aqui poderíamos colocar um array filter
        // para retornar um array de postagens mais curtidas.
        return this.postagens[indiceMostLiked];
    }
    curtir(id) {
        // Procurar a postagem com esse id, e chamar sua função curtir.
        let indice = this.consultarPorIndice(id);
        if (indice != -1) {
            let postagem = this.postagens[indice];
            postagem.curtir();
            return true;
        }
        return false;
    }
    toString() {
        let str = "";
        for (let i = 0; i < this.postagens.length; i++) {
            str += this.postagens[i].toString();
        }
        return str;
    }
    constructor() {
        this.postagens = [];
    }
}
function showMenu() {
    (0, utils_1.limparTerminal)();
    (0, utils_1.showCenterText)("PatroBlog");
    (0, utils_1.showCenterText)("1 - Escrever Postagem");
    (0, utils_1.showCenterText)("2 - Curtir Postagem");
    (0, utils_1.showCenterText)("3 - Consultar Postagens");
    (0, utils_1.showCenterText)("4 - Excluir Postagem");
    (0, utils_1.showCenterText)("0 - Sair");
    (0, utils_1.limparTerminal)();
    let opcoes = readMenuOptions();
    if (opcoes == undefined) {
        console.log("Erro ao ler opções do menu.");
        return;
    }
    for (let i = 0; i < opcoes.length; i++) {
        (0, utils_1.showCenterText)(String(opcoes[i]));
    }
}
function readMenuOptions() {
    const arquivoMenu = "./menuOptions.txt";
    const opcoes = (0, fs_1.readFileSync)(arquivoMenu, "utf-8").split("\n");
    if (opcoes.length == 0) {
        return undefined;
    }
    else {
        return opcoes;
    }
}
async function main() {
    const MICROBLOG = new Microblog();
    let opcao = -1;
    do {
        showMenu();
        opcao = Number((0, readline_sync_1.question)("INSIRA UMA OPCAO", { limit: [0, 1, 2, 3, 4] }));
        if (opcao == 1) {
            (0, utils_1.showCenterText)("ESCREVA IMEDIATAMENTE:");
            let textoDaPostagem = (0, utils_1.obterTexto)();
            let postagem = new Postagem(textoDaPostagem);
            MICROBLOG.inserirPostagem(postagem);
            console.log("Postagem inserida com sucesso oh doido");
        }
        if (opcao == 2) {
            (0, utils_1.showCenterText)("ID DA POSTAGEM PRA CURTIR:");
            let id = Number((0, utils_1.obterTexto)());
            MICROBLOG.curtir(id);
        }
        if (opcao == 3) {
            (0, utils_1.showCenterText)(MICROBLOG.toString());
        }
        if (opcao == 4) {
            (0, utils_1.showCenterText)("ID DA POSTAGEM PRA EXCLUIR:");
            let id = Number((0, utils_1.obterTexto)());
            if (MICROBLOG.excluirPostagem(id)) {
                (0, utils_1.showCenterText)(`POSTAGEM DE ID ${id} EXCLUÍDA`);
            }
            else {
                (0, utils_1.showCenterText)(`NÃO DEU PRA EXCLUIR NAO OH DOIDO`);
            }
        }
        (0, utils_1.enterToContinue)();
    } while (opcao != 0);
    (0, utils_1.showCenterText)("Tchau!");
    // Exibir xingamento aleatório.
    (0, utils_1.showCenterText)("Vai se fuder, seu merda!");
    (0, utils_1.enterToContinue)();
}
main();
