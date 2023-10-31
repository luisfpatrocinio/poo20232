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
const viewUtils_1 = require("./Utils/viewUtils");
class App {
    constructor() {
        this._qntPerfisCriados = 0;
        this._qntPostagensCriadas = 0;
        // @TODO: Essa quantidade deve ser salva em arquivo, para que não seja perdida ao reiniciar o programa.
        this.menuOpcoes = [
            ["Criar Perfil", this.criarPerfil],
            ["Criar Postagem", this.criarPostagem],
            ["Listar Perfis", this.listarPerfis],
            ["Ver Feed", this.verFeed],
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
    exibirMenu() {
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.showBlogLogo)();
        (0, viewUtils_1.exibirTextoNoCentro)("~ Menu Principal ~");
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            (0, viewUtils_1.exibirTextoEsquerda)(`${i + 1} - ${this.menuOpcoes[i][0]}`);
        }
        (0, viewUtils_1.exibirTextoEsquerda)("0 - Sair");
    }
    executarOpcao(opcao) {
        if (opcao == 0)
            return;
        let funcao = this.menuOpcoes[opcao - 1][1];
        funcao.call(this);
    }
    criarPerfil() {
        (0, ioUtils_1.exibirTexto)("# Criar Perfil");
        let id = ++this._qntPerfisCriados;
        let nome = (0, readline_sync_1.question)("Nome: ");
        let email;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
            email = (0, readline_sync_1.question)("Email: ");
        } while (!email.includes("@") || !email.includes("."));
        let perfil = new perfil_1.Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
        (0, ioUtils_1.exibirTexto)(`Perfil ${nome} criado com sucesso. ID: ${id}`);
    }
    criarPostagem() {
        (0, ioUtils_1.exibirTextoCentralizado)("# Criar Postagem #");
        // Checar se há perfis criados.
        if (this._qntPerfisCriados == 0) {
            (0, ioUtils_1.exibirTexto)("Nenhum perfil encontrado. Crie um perfil antes de criar uma postagem.");
            return;
        }
        let id = ++this._qntPostagensCriadas;
        let curtidas = 0;
        let descurtidas = 0;
        let data = new Date; // Obter data atual do sistema
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            // Listar perfis.
            this.listarPerfis();
            (0, ioUtils_1.exibirTexto)("0 - Cancelar");
            // Obter ID do perfil:
            idPerfil = (0, ioUtils_1.obterNumeroInteiro)("ID do perfil: ");
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
        (0, viewUtils_1.prepararTelaPostagem)(perfil);
        let texto = (0, readline_sync_1.question)("Texto: ");
        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            var _postagem = new postagem_1.Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            (0, ioUtils_1.exibirTexto)(`Postagem No ${id} criada com sucesso.`);
        }
    }
    listarPerfis() {
        if (this._qntPerfisCriados == 0) {
            (0, ioUtils_1.exibirTexto)("Nenhum perfil encontrado.");
            return;
        }
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
            this.exibirMenu();
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
