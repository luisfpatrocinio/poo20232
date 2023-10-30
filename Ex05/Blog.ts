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

import { question } from "readline-sync";
import { obterTexto, showCenterText, enterToContinue, limparTerminal } from "../utils";
import { readFileSync } from "fs";

class Postagem {
    id: number = 0;
    texto: string;
    likes: number = 0;

    curtir(): void {
        this.likes++;
    }

    toString(): string {
        return this.texto + " - likes: " + String(this.likes);
    }

    constructor(_texto: string = "") {
        this.texto = _texto;
    }
}

class Microblog {
    postagens: Postagem[];

    inserirPostagem(postagem: Postagem): void {
        let novaPostagem = postagem;
        novaPostagem.id = this.postagens.length;
        novaPostagem.likes = 0;
        this.postagens.push(novaPostagem);
    }

    // Percorre as postagens e retorna sua posição no array postagens.
    consultarPorIndice(id: number): number {
        let indiceEncontrado = -1;
        for (let i = 0; i < this.postagens.length; i++) {
            if (this.postagens[i].id == id) {
                indiceEncontrado = i;
                break
            }
        }
        return indiceEncontrado
    }

    excluirPostagem(id: number): boolean {
        // Percorrer as postagens e encontrar a do ID desejado.
        let indiceDesejado = this.consultarPorIndice(id);

        // Se a postagem desejada existir:
        if (indiceDesejado != -1) {
            for (let i = indiceDesejado; i < this.postagens.length - 1; i++) {
                this.postagens[i] = this.postagens[i + 1]
            }
            this.postagens.pop();
            return true;
        }
        return false;
    }

    obterPostagemMaisCurtida(): Postagem {
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

    curtir(id: number): boolean{
        // Procurar a postagem com esse id, e chamar sua função curtir.
        let indice = this.consultarPorIndice(id);
        if (indice != -1) {
            let postagem = this.postagens[indice];
            postagem.curtir();
            return true;
        }
        return false;
    }

    toString(): string {
        let str = "";
        for (let i = 0; i < this.postagens.length; i++) {
            str += this.postagens[i].toString();
        }
        return str
    }

    constructor() {
        this.postagens = [];
    }
}

function showMenu() {
    limparTerminal();
    showCenterText("PatroBlog");
    showCenterText("1 - Escrever Postagem");
    showCenterText("2 - Curtir Postagem");
    showCenterText("3 - Consultar Postagens");
    showCenterText("4 - Excluir Postagem");
    showCenterText("0 - Sair");
    limparTerminal();
    let opcoes = readMenuOptions();
    if (opcoes == undefined) {
        console.log("Erro ao ler opções do menu.");
        return;
    }
    for (let i = 0; i < opcoes.length; i++) {
        showCenterText(String(opcoes[i]));
    }
}

function readMenuOptions() : string[] | undefined {
    const arquivoMenu = "./menuOptions.txt";
    const opcoes = readFileSync(arquivoMenu, "utf-8").split("\n");
    if (opcoes.length == 0) {
        return undefined;
    } else {
        return opcoes;
    }
}

async function main() {
    const MICROBLOG = new Microblog();

    let opcao = -1;
    do {
        showMenu();
        opcao = Number(question("INSIRA UMA OPCAO", { limit: [0, 1, 2, 3, 4] }));
        if (opcao == 1) {
            showCenterText("ESCREVA IMEDIATAMENTE:");
            let textoDaPostagem = obterTexto();
            let postagem = new Postagem(textoDaPostagem);
            MICROBLOG.inserirPostagem(postagem);
            console.log("Postagem inserida com sucesso oh doido")
        }
        if (opcao == 2) {
            showCenterText("ID DA POSTAGEM PRA CURTIR:");
            let id = Number(obterTexto());
            MICROBLOG.curtir(id);
        }
        if (opcao == 3) {
            showCenterText(MICROBLOG.toString());
        }
        if (opcao == 4) {
            showCenterText("ID DA POSTAGEM PRA EXCLUIR:");
            let id = Number(obterTexto());
            if (MICROBLOG.excluirPostagem(id)) {
                showCenterText(`POSTAGEM DE ID ${id} EXCLUÍDA`);
            } else {
                showCenterText(`NÃO DEU PRA EXCLUIR NAO OH DOIDO`);
            }
        }
        enterToContinue();
    } while (opcao != 0);
    showCenterText("Tchau!");
    // Exibir xingamento aleatório.
    showCenterText("Vai se fuder, seu merda!");
    enterToContinue();
}

main();