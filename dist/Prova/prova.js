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
        // Atributos necessários para gerenciar os IDs dos perfis e postagens.
        this._qntPerfisCriados = 0;
        this._qntPostagensCriadas = 0;
        this.menuOpcoes = [
            // Nome da opção, função a ser executada, condição para habilitar a opção
            ["Criar Perfil", this.criarPerfil, () => true],
            ["Criar Postagem", this.criarPostagem, () => this._qntPerfisCriados > 0],
            ["Listar Perfis", this.listarPerfis, () => this._qntPerfisCriados > 0],
            ["Ver Feed", this.verFeed, () => this._qntPostagensCriadas > 0],
            ["Editar Perfis", this.editarPerfis, () => this._qntPerfisCriados > 0],
        ];
        this._redeSocial = new redeSocial_1.RedeSocial;
        // Inicializar App
        // Ler arquivo:
        try {
            // Carregar Arquivos caso hajam.
            this.carregarPerfis();
            this.carregarPostagens();
            // Tela de início
            this.wakeUpScreen();
            (0, ioUtils_1.enterToContinue)();
        }
        catch (erro) {
            // Iniciando pela primeira vez.
            (0, viewUtils_1.mainBackground)();
            (0, viewUtils_1.exibirTextoCentroCentro)("Iniciando pela primeira vez.");
            (0, fs_1.writeFileSync)("savePerfis.txt", "oi");
        }
    }
    wakeUpScreen() {
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.saltarLinhas)(Math.floor((0, viewUtils_1.obterAlturaTerminal)() / 2) - 3);
        (0, viewUtils_1.showBlogLogo)();
        (0, ioUtils_1.exibirTextoCentralizado)(`${this._qntPerfisCriados} perfis carregados`);
        (0, ioUtils_1.exibirTextoCentralizado)(`${this._qntPostagensCriadas} postagens carregadas`);
    }
    salvarPerfis() {
        let saveString = "";
        var _perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < _perfis.length; i++) {
            var _perfil = _perfis[i];
            if (_perfil != null) {
                saveString += `${_perfil.id}#${_perfil.nome}#${_perfil.email}\n`;
            }
        }
        const file = (0, fs_1.writeFileSync)("savePerfis.txt", saveString);
    }
    carregarPerfis() {
        // Ler Arquivos
        let perfis = new Array;
        let perfisString = new Array;
        try {
            // Ler arquivo de perfis "savePerfis.txt"
            let _conteudo = (0, fs_1.readFileSync)("savePerfis.txt", "utf-8").split("\n");
            // Percorrer conteudo e adicionar aos perfis
            for (let i = 0; i < _conteudo.length; i++) {
                if (_conteudo[i] != "") {
                    perfisString.push(_conteudo[i]);
                }
            }
            // Para cada linha do arquivo
            for (let i = 0; i < perfisString.length; i++) {
                if (perfisString[i] != "") {
                    // Separar o id e o nome
                    let _perfil = perfisString[i].split("#");
                    // Criar um registro com id e nome
                    let _cadastroPerfil = new perfil_1.Perfil(Number(_perfil[0]), _perfil[1], _perfil[2]);
                    // Adicionar o objeto no vetor de perfis
                    perfis[i] = _cadastroPerfil;
                }
            }
            // @TODO: Deve-se aqui atribuir as postagens a cada perfil, talvez?
            this._redeSocial.atribuirPerfisCarregados(perfis);
            this._qntPerfisCriados = perfis.length;
            this.salvarPerfis();
        }
        catch (err) {
            console.log("###");
            console.log("ERRO AO CARREGAR PERFIS#");
            console.log("###");
        }
    }
    salvarPostagens() {
        let saveString = "";
        var _postagens = this._redeSocial.obterPostagens();
        for (let i = 0; i < _postagens.length; i++) {
            var p = _postagens[i];
            var _isAdvanced = p instanceof postagem_1.PostagemAvancada;
            var _adv = String(Number(_isAdvanced));
            // Tratamentos em caso de postagem avançada:
            var _hashtagsString = "";
            var _views = "";
            if (p instanceof postagem_1.PostagemAvancada) {
                // @TODO: Adicionar um get para obter as hashtags
                for (let h = 0; h < p.hashtags.length; h++) {
                    _hashtagsString += p.hashtags[h];
                    if (h + 1 < p.hashtags.length) {
                        _hashtagsString += "#";
                    }
                }
                _views = String(p.visualizacoesRestantes);
            }
            saveString += `${p.id}#${_adv}#${p.texto}#${p.curtidas}#${p.descurtidas}#40#${p.perfil.id}#${_hashtagsString}#${_views}\n`;
        }
        const file = (0, fs_1.writeFileSync)("savePostagens.txt", saveString);
    }
    carregarPostagens() {
        let postagens = new Array;
        let postagensString = new Array;
        try {
            // Ler arquivo de postagens
            let _conteudo = (0, fs_1.readFileSync)("savePostagens.txt", "utf-8").split("\n");
            // Percorrer conteudo e adicionar as postagens
            _conteudo.forEach((post) => {
                if (post != "")
                    postagensString.push(post);
            });
            // Para cada postagem em string:
            postagensString.forEach((post) => {
                if (post != "") { // @TODO: Checar se essa checagem é necessária.
                    // Separar elementos:
                    let _fichaPostagem = post.split("#");
                    // Conferir se é uma postagem avançada:
                    let _advanced = (_fichaPostagem[1] === "1") ? true : false;
                    // Criar um registro com id e nome:
                    let _cadastroPostagem;
                    let _perfilID = Number(_fichaPostagem[6]);
                    let _perfil = this._redeSocial.consultarPerfil(_perfilID, undefined, undefined);
                    let _curtidas = Number(_fichaPostagem[3]);
                    let _descurtidas = Number(_fichaPostagem[4]);
                    let _data = new Date(); // @TODO: Pegar a data correta a partir do arquivo.
                    if (_perfil != null) {
                        if (_advanced) {
                            var _hashtags = _fichaPostagem[7].split("-");
                            var _visualizacoes = Number(_fichaPostagem[8]);
                            _cadastroPostagem = new postagem_1.PostagemAvancada(Number(_fichaPostagem[0]), _fichaPostagem[2], _curtidas, _descurtidas, _data, _perfil, _hashtags, _visualizacoes);
                        }
                        else {
                            _cadastroPostagem = new postagem_1.Postagem(Number(_fichaPostagem[0]), _fichaPostagem[2], _curtidas, _descurtidas, _data, _perfil);
                        }
                        // Adicionar ao array de postagens.
                        postagens.push(_cadastroPostagem);
                        this._qntPostagensCriadas++;
                    }
                }
            });
            // Postagens carregadas
            this._redeSocial.atribuirPostagensCarregadas(postagens);
            // BACKUP:
            // 1#0#Eu gosto de jogar lolzinho.#300#250#40#1
            // 2#1#Eu gosto de jogar lolzinho.#300#250#40#1#humor-saude-tbt#200
        }
        catch (err) {
            console.log(err);
            (0, ioUtils_1.enterToContinue)();
        }
    }
    // Solicita uma opção ao usuário.
    obterOpcao() {
        var opcoes = this.obterMenuParaExibir();
        let opcao = (0, ioUtils_1.obterNumeroInteiro)("Opcao: ");
        while (opcao < 0 || opcao > opcoes.length) {
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
        if (opcao == 0) {
            // Opcção de sair.
            this.despedida();
            return;
        }
        const opcoesValidas = this.obterMenuParaExibir();
        let funcao = opcoesValidas[opcao - 1][1];
        funcao.call(this);
    }
    despedida() {
        (0, viewUtils_1.limparTerminal)();
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.saltarLinhas)(Math.floor((0, viewUtils_1.obterAlturaTerminal)() / 2) - 1);
        (0, ioUtils_1.exibirTextoCentralizado)("Obrigado e volte sempre!");
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
        this.salvarPerfis();
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
        this.salvarPostagens();
    }
    listarPerfisCurto() {
        let perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < perfis.length; i++) {
            var _perfil = perfis[i];
            (0, ioUtils_1.exibirTexto)(`${_perfil.id} - ${_perfil.nome}`);
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
                (0, ioUtils_1.exibirTextoPostagem)(`${_post.texto}`);
                // Mostrar hashtags:
                if (_post instanceof postagem_1.PostagemAvancada) {
                    let hashtagsString = "";
                    _post.hashtags.forEach((h) => {
                        hashtagsString += "#" + h + " ";
                    });
                    (0, ioUtils_1.exibirTexto)(hashtagsString);
                }
                var _curtidasStr = `${_post.curtidas} curtidas, ${_post.descurtidas} descurtidas.`;
                (0, ioUtils_1.exibirTexto)(_curtidasStr);
                (0, viewUtils_1.exibirTextoNoCentro)("-=-");
                console.log();
            }
            (0, viewUtils_1.exibirTextoNoCentro)(`Página ${_pagina + 1}/${_totalPaginas}`);
            _pagina++;
            if (_pagina < _totalPaginas)
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
        if (perfilParaEditar == null) {
            // Perfil não encontrado.
            (0, ioUtils_1.exibirTexto)(`Não encontramos um perfil com esse atributo.`);
            return;
        }
        (0, ioUtils_1.exibirTexto)(`Vamos então editar o perfil: ${perfilParaEditar.nome}`);
        // @TODO: Completar
        // 1 - Encontrar indice do perfil no array this._redeSocial.obterPerfis() --- lembrando que os perfis ficam em Repositorio de Perfis
        // 2 - Pedir novo nome e email
        // 3 - Sobreescrever array do repositorio de perfis.
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
        (0, viewUtils_1.limparTerminal)();
        (0, ioUtils_1.exibirTextoCentralizado)("=== FIM ===");
    }
}
function main() {
    const app = new App();
    app.executar();
}
main();
