"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importar bibliotecas principais:
const readline_sync_1 = require("readline-sync");
const perfil_1 = require("./Classes/perfil");
const postagem_1 = require("./Classes/postagem");
const redeSocial_1 = require("./Classes/redeSocial");
// Importar Utils
const ioUtils_1 = require("./Utils/ioUtils");
const utils_1 = require("../utils");
class App {
    constructor() {
        this.menuOpcoes = [
            "Criar Perfil",
            "Criar Postagem",
            "Listar Perfis",
            "Ver Feed"
        ];
        this._redeSocial = new redeSocial_1.RedeSocial;
    }
    obterOpcao() {
        let opcao = (0, ioUtils_1.obterNumeroInteiro)("Opcao: ");
        while (opcao < 0 || opcao > this.menuOpcoes.length) {
            (0, ioUtils_1.exibirTexto)("Opcao inválida. Tente novamente.");
            opcao = this.obterOpcao();
        }
        return opcao;
    }
    exibirOpcoes() {
        (0, ioUtils_1.exibirTextoCentralizado)("--- MENU ---");
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            (0, ioUtils_1.exibirTexto)(`${i + 1} - ${this.menuOpcoes[i]}`);
        }
        (0, ioUtils_1.exibirTexto)("0 - Sair");
    }
    executarOpcao(opcao) {
        switch (opcao) {
            case 1:
                this.criarPerfil();
                break;
            case 2:
                this.criarPostagem();
                break;
            case 3:
                this.listarPerfis();
                break;
            case 4:
                this.verFeed();
                break;
        }
    }
    criarPerfil() {
        (0, ioUtils_1.exibirTexto)("# Criar Perfil");
        let id = this._redeSocial.obterQuantidadeDePerfis() + 1;
        let nome = (0, readline_sync_1.question)("Nome: ");
        let email = (0, readline_sync_1.question)("Email: ");
        let perfil = new perfil_1.Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
    }
    criarPostagem() {
        (0, ioUtils_1.exibirTexto)("# Criar Postagem");
        let id = this._redeSocial.obterQuantidadeDePostagens() + 1;
        let curtidas = 0;
        let descurtidas = 0;
        let data = new Date; // Obter data atual do sistema
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            idPerfil = (0, ioUtils_1.obterNumeroInteiro)("ID do perfil: ");
            // Aqui seria interessante listar os perfis, e mostrar a opcao 0 - Cancelar.
            perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
            if (perfil === null) {
                (0, ioUtils_1.exibirTexto)("Perfil não encontrado.");
                idPerfil = -1; // Voltando a -1, faz permanecer no ciclo.
                tentativasDeEncontrarPerfil++;
            }
            // Porém, se esgotar 3 tentativas, é melhor abortar a criação de postagem.
            if (tentativasDeEncontrarPerfil > 3) {
                (0, ioUtils_1.exibirTexto)("Tente novamente mais tarde.");
                return;
            }
        }
        // Perfil encontrado, continuar a criação da postagem:
        let texto = (0, readline_sync_1.question)("Texto: ");
        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            var _postagem = new postagem_1.Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            (0, ioUtils_1.exibirTexto)(`Postagem No ${id} criada com sucesso.`);
        }
    }
    listarPerfis() {
        this._redeSocial.listarPerfis();
    }
    verFeed() {
        (0, ioUtils_1.exibirTexto)("Feed da Rede Social");
        let postagens = this._redeSocial.consultarPostagens(undefined, undefined, undefined, undefined);
        postagens.forEach((post) => {
            (0, ioUtils_1.exibirTexto)(`Postagem ${post.id}, por ${post.perfil.nome}: ${post.texto}`);
            console.log();
        });
    }
    executar() {
        let opcao = -1;
        while (opcao != 0) {
            (0, utils_1.limparTerminal)();
            (0, ioUtils_1.exibirTextoCentralizado)("Rede Social");
            this.exibirOpcoes();
            opcao = this.obterOpcao();
            this.executarOpcao(opcao);
            (0, utils_1.enterToContinue)();
        }
        (0, ioUtils_1.exibirTextoCentralizado)("=== FIM ===");
    }
}
function main() {
    const app = new App();
    app.executar();
}
main();
