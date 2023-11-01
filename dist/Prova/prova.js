"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importar bibliotecas principais:
const readline_sync_1 = require("readline-sync");
const perfil_1 = require("./Classes/perfil");
const postagem_1 = require("./Classes/postagem");
const redeSocial_1 = require("./Classes/redeSocial");
// Importar Utils
const ioUtils_1 = require("./Utils/ioUtils");
const viewUtils_1 = require("./Utils/viewUtils");
// Leitura e Gravação de Arquivos
const fs_1 = require("fs");
class App {
    constructor() {
        this._qntPerfisCriados = 0;
        this._qntPostagensCriadas = 0;
        // @TODO: Essa quantidade deve ser salva em arquivo, para que não seja perdida ao reiniciar o programa.
        this.menuOpcoes = [
            // Nome da opção, função a ser executada, condição para habilitar a opção
            ["Criar Perfil", this.criarPerfil, () => true],
            ["Criar Postagem", this.criarPostagem, () => this._qntPerfisCriados > 0],
            ["Listar Perfis", this.listarPerfis, () => this._qntPerfisCriados > 0],
            ["Ver Feed", this.verFeed, () => this._qntPostagensCriadas > 0],
            ["Editar Perfis", this.editarPerfis, () => this._qntPerfisCriados > 0]
        ];
        this._redeSocial = new redeSocial_1.RedeSocial;
        // Ler arquivo:
        try {
            const file = (0, fs_1.readFileSync)('savePerfis.txt', 'utf-8');
        }
        catch (erro) {
            // Iniciando pela primeira vez.
            (0, viewUtils_1.exibirTextoCentroCentro)("Iniciando pela primeira vez.");
            (0, viewUtils_1.mainBackground)();
            (0, fs_1.writeFileSync)("savePerfis.txt", "oi");
        }
        console.log((0, readline_sync_1.question)('aaa'));
    }
    // Solicita uma opção ao usuário.
    obterOpcao() {
        let opcao = (0, ioUtils_1.obterNumeroInteiro)("Opcao: ");
        while (opcao < 0 || opcao > this.menuOpcoes.length) {
            (0, ioUtils_1.exibirTexto)("Opcao inválida. Tente novamente.");
            opcao = this.obterOpcao();
        }
        return opcao;
    }
    obterMenuParaExibir() {
        var menu = new Array;
        // Filtramos o menu, para mostrar apenas as opções que satisfaçam a função no índice 2.
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            var opt = this.menuOpcoes[i];
            if (opt[2]()) {
                menu.push(opt);
            }
        }
        return menu;
    }
    exibirMenu() {
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.showBlogLogo)();
        (0, viewUtils_1.exibirTextoNoCentro)("~ Menu Principal ~");
        // O menu exibido será o menu 
        const menuParaExibir = this.obterMenuParaExibir();
        for (let i = 0; i < menuParaExibir.length; i++) {
            (0, viewUtils_1.exibirTextoEsquerda)(`${i + 1} - ${menuParaExibir[i][0]}`);
        }
        (0, viewUtils_1.exibirTextoEsquerda)("0 - Sair");
    }
    executarOpcao(opcao) {
        if (opcao == 0)
            return;
        const opcoesValidas = this.obterMenuParaExibir();
        let funcao = opcoesValidas[opcao - 1][1];
        funcao.call(this);
    }
    criarPerfil() {
        (0, viewUtils_1.cabecalhoPrincipal)("Criar Perfil");
        let id = ++this._qntPerfisCriados;
        let nome = (0, ioUtils_1.obterTexto)("Nome: ");
        let email;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
            email = (0, ioUtils_1.obterTexto)("Email: ");
        } while (!email.includes("@") || !email.includes("."));
        let perfil = new perfil_1.Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
        (0, viewUtils_1.exibirTextoNoCentro)(`Perfil ${nome} criado com sucesso.`);
        (0, viewUtils_1.exibirTextoNoCentro)(`ID: ${id}`);
    }
    criarPostagem() {
        (0, viewUtils_1.cabecalhoPrincipal)("Criar Postagem");
        let id = this._qntPostagensCriadas + 1;
        let curtidas = 0;
        let descurtidas = 0;
        let data = new Date; // Obter data atual do sistema
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            // Listar perfis.
            this.listarPerfisCurto();
            (0, ioUtils_1.exibirTexto)("0 - Cancelar");
            // Obter ID do perfil:
            idPerfil = (0, ioUtils_1.obterNumeroInteiro)("ID do perfil: ");
            // Optou por sair:
            if (idPerfil == 0) {
                (0, ioUtils_1.exibirTexto)("Cancelando...");
                return;
            }
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
        // Perfil encontrado, continuar a criação da postagem.
        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            (0, viewUtils_1.prepararTelaPostagem)(perfil);
            let texto = (0, readline_sync_1.question)("Texto: ");
            var _postagem = new postagem_1.Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            this._qntPostagensCriadas++;
            1;
            (0, viewUtils_1.exibirTextoNoCentro)(`Postagem No ${id} criada com sucesso.`);
        }
    }
    listarPerfisCurto() {
        let perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < perfis.length; i++) {
            var _perfil = perfis[i];
            (0, ioUtils_1.exibirTexto)(`Perfil ${_perfil.id} - ${_perfil.nome}`);
        }
        if (perfis.length == 0) {
            (0, ioUtils_1.exibirTexto)("Nenhum perfil encontrado.");
        }
    }
    listarPerfis() {
        (0, viewUtils_1.cabecalhoPrincipal)("Perfis Cadastrados");
        let perfis = this._redeSocial.obterPerfis();
        // @TODO: Limitar exibições por página, semelhante a função verFeed
        for (let i = 0; i < perfis.length; i++) {
            var _p = perfis[i];
            (0, ioUtils_1.exibirTexto)(`ID ${_p.id}:`);
            (0, ioUtils_1.exibirTexto)(`Nome: ${_p.nome}`);
            (0, ioUtils_1.exibirTexto)(`Email: ${_p.email}`);
            (0, viewUtils_1.exibirTextoNoCentro)(`x`);
            console.log();
        }
    }
    verFeed() {
        let postagens = this._redeSocial.obterPostagens();
        var _pagina = 0;
        var _postsPorPagina = Math.floor(((0, viewUtils_1.obterAlturaTerminal)() - 10) / 4);
        _postsPorPagina = 4;
        var _totalPaginas = Math.ceil(postagens.length / _postsPorPagina);
        while (_pagina < _totalPaginas) {
            (0, viewUtils_1.feedView)();
            for (let i = 0; i < _postsPorPagina; i++) {
                var n = _pagina * _postsPorPagina + i;
                if (n >= postagens.length)
                    break;
                var _post = postagens[n];
                (0, ioUtils_1.exibirTexto)(`${_post.data.toUTCString()}`);
                (0, ioUtils_1.exibirTexto)(`${_post.perfil.nome}:`);
                (0, ioUtils_1.exibirTexto)(`${_post.texto}`);
                var _curtidasStr = `${_post.curtidas} curtidas, ${_post.descurtidas} descurtidas.`;
                (0, ioUtils_1.exibirTexto)(_curtidasStr);
                (0, viewUtils_1.exibirTextoNoCentro)("x");
                console.log();
            }
            (0, viewUtils_1.exibirTextoNoCentro)(`Página ${_pagina + 1}/${_totalPaginas}`);
            _pagina++;
            (0, ioUtils_1.enterToContinue)();
        }
    }
    editarPerfis() {
        (0, viewUtils_1.cabecalhoPrincipal)("Editar Perfis");
        // Exibir de forma sintetizada os perfis disponíveis.
        this.listarPerfisCurto();
        // Inicializar variável que vai guardar o perfil.
        let perfilParaEditar = null;
        // Receber atributo desejado do usuário
        (0, ioUtils_1.exibirTexto)("Qual perfil deseja editar? (ID/Nome/Email)");
        let atributoDesejado = (0, ioUtils_1.obterTexto)("");
        // O valor inserido é um número? Se sim, deve ser tratado como ID.
        if (!isNaN(Number(atributoDesejado))) {
            perfilParaEditar = this._redeSocial.consultarPerfil(Number(atributoDesejado), undefined, undefined);
        }
        else if (typeof (atributoDesejado) == "string") {
            // Verificar se é email:
            if (atributoDesejado.includes("@") && atributoDesejado.includes(".")) {
                perfilParaEditar = this._redeSocial.consultarPerfil(undefined, undefined, atributoDesejado);
            }
            else {
                // Atributo desejado é nome:
                perfilParaEditar = this._redeSocial.consultarPerfil(undefined, atributoDesejado, undefined);
            }
        }
        // Encontramos o perfil:
        if (perfilParaEditar != null) {
            console.log(`Vamos então editar o perfil: ${perfilParaEditar.nome}`);
        }
        else {
            // Perfil não encontrado.
            console.log(`Não encontramos um perfil com esse atributo.`);
        }
        (0, ioUtils_1.enterToContinue)();
    }
    executar() {
        let opcao = -1;
        while (opcao != 0) {
            (0, viewUtils_1.limparTerminal)();
            this.exibirMenu();
            opcao = this.obterOpcao();
            this.executarOpcao(opcao);
            (0, ioUtils_1.enterToContinue)();
        }
        (0, ioUtils_1.exibirTextoCentralizado)("=== FIM ===");
    }
}
function main() {
    const app = new App();
    app.executar();
}
main();
