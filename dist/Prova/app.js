"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perfil_1 = require("./Classes/perfil");
const postagem_1 = require("./Classes/postagem");
const redeSocial_1 = require("./Classes/redeSocial");
// Importar Utils
const ioUtils_1 = require("./Utils/ioUtils");
const viewUtils_1 = require("./Utils/viewUtils");
const generalUtils_1 = require("./Utils/generalUtils");
// Leitura e Gravação de Arquivos
const fs_1 = require("fs");
// Visual
const chalk = require('chalk');
class App {
    constructor() {
        // Atributos necessários para gerenciar os IDs dos perfis e postagens.
        this._qntPerfisCriados = 0;
        this._qntPostagensCriadas = 0;
        this.menuOpcoes = [
            // Nome da opção, função a ser executada, condição para habilitar a opção
            ["Criar Perfil", this.criarPerfil, () => true],
            ["Listar Perfis", this.listarPerfis, () => this._redeSocial.obterPerfis().length > 0],
            ["Editar Perfis", this.editarPerfis, () => this._redeSocial.obterPerfis().length > 0],
            ["Excluir Perfil", this.excluirPerfil, () => this._redeSocial.obterPerfis().length > 0],
            ["Criar Postagem", this.criarPostagem, () => this._redeSocial.obterPerfis().length > 0],
            ["Ver Feed", this.verFeed, () => this._redeSocial.obterPostagens().length > 0],
            ["Exibir Postagens por Perfil", this.exibirPostagensPorPerfil, () => this._redeSocial.obterPostagens().length > 0 && this._redeSocial.obterPerfis().length > 0],
            ["Exibir Postagens por Hashtag", this.exibirPostagensPorHashtag, () => this._redeSocial.obterPostagens().length > 0]
        ];
        this._opcaoSelecionada = 0;
        this._redeSocial = new redeSocial_1.RedeSocial;
        try {
            // Carregar Arquivos caso hajam.
            this.carregarPerfis();
            this.carregarPostagens();
        }
        catch (erro) {
            // Iniciando pela primeira vez.
            (0, viewUtils_1.mainBackground)();
            (0, viewUtils_1.exibirTextoNoCentro)("Iniciando pela primeira vez.");
            (0, ioUtils_1.enterToContinue)();
        }
    }
    wakeUpScreen() {
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.saltarLinhas)(Math.floor((0, viewUtils_1.obterAlturaTerminal)() / 2) - 3);
        (0, viewUtils_1.showBlogLogo)();
        var _qntPerfis = this._redeSocial.obterPerfis().length;
        if (_qntPerfis > 0)
            (0, viewUtils_1.exibirTextoNoCentro)(`${_qntPerfis} perfis carregados`);
        var _qntPostagens = this._redeSocial.obterPostagens().length;
        if (_qntPostagens > 0)
            (0, viewUtils_1.exibirTextoNoCentro)(`${_qntPostagens} postagens carregadas`);
    }
    // Funções de Salvar e Carregar
    salvarPerfis() {
        let saveString = "";
        var _perfis = this._redeSocial.obterPerfis();
        saveString += `perfisCriados:${this._qntPerfisCriados}\n`;
        for (let i = 0; i < _perfis.length; i++) {
            var _perfil = _perfis[i];
            if (_perfil != null) {
                saveString += `${_perfil.id}|${_perfil.nome}|${_perfil.email}\n`;
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
            if (_conteudo.length > 0)
                this._qntPerfisCriados = Number(_conteudo[0].split(":")[1]);
            for (let i = 1; i < _conteudo.length; i++) {
                if (_conteudo[i] != "") {
                    perfisString.push(_conteudo[i]);
                }
            }
            // Para cada linha do arquivo
            for (let i = 0; i < perfisString.length; i++) {
                if (perfisString[i] != "") {
                    // Separar o id e o nome
                    let _perfil = perfisString[i].split("|");
                    // Criar um registro com id e nome
                    let _cadastroPerfil = new perfil_1.Perfil(Number(_perfil[0]), _perfil[1], _perfil[2]);
                    // Adicionar o objeto no vetor de perfis
                    perfis[i] = _cadastroPerfil;
                }
            }
            // @TODO: Deve-se aqui atribuir as postagens a cada perfil, talvez?
            this._redeSocial.atribuirPerfisCarregados(perfis);
            this.salvarPerfis();
        }
        catch (err) {
            // mainBackground();
            // saltarLinhas(obterLarguraTerminal()/2);
            // exibirTextoCentralizado("Não foram encontrados perfis.");
            // enterToContinue();
        }
    }
    salvarPostagens() {
        let saveString = "";
        saveString += `postagensCriadas:${this._qntPostagensCriadas}\n`;
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
                        _hashtagsString += "¨";
                    }
                }
                _views = String(p.visualizacoesRestantes);
            }
            // @TODO: Colocar a data da postagem de maneira correta.
            saveString += `${p.id}|${_adv}|${p.texto}|${p.curtidas}|${p.descurtidas}|40|${p.perfil.id}|${_hashtagsString}|${_views}\n`;
        }
        const file = (0, fs_1.writeFileSync)("savePostagens.txt", saveString);
    }
    carregarPostagens() {
        let postagens = new Array;
        let postagensString = new Array;
        try {
            // Ler arquivo de postagens
            let _conteudo = (0, fs_1.readFileSync)("savePostagens.txt", "utf-8").split("\n");
            if (_conteudo.length > 0)
                this._qntPostagensCriadas = Number(_conteudo[0].split(":")[1]);
            // Percorrer conteudo e adicionar as postagens
            for (let i = 1; i < _conteudo.length; i++) {
                if (_conteudo[i] != "") {
                    postagensString.push(_conteudo[i]);
                }
            }
            // Para cada postagem em string:
            postagensString.forEach((post) => {
                if (post != "") { // @TODO: Checar se essa checagem é necessária.
                    // Separar elementos:
                    let _fichaPostagem = post.split("|");
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
                            var _hashtags = _fichaPostagem[7].split("¨");
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
        }
    }
    // Solicita uma opção ao usuário.
    obterOpcao() {
        var opcoes = this.obterMenuParaExibir();
        var min = 0;
        var max = opcoes.length; // A opção máxima é 1 a mais, porque ainda tem a opção SAIR.
        var rsync = require('readline-sync');
        var key = rsync.keyIn('', {
            hideEchoBack: true,
            mask: '',
            limit: 'ZXCzxc ',
            hideCursor: true,
        });
        if (key.toString().toLowerCase() == 'z')
            this._opcaoSelecionada--;
        else if (key.toString().toLowerCase() == 'x')
            this._opcaoSelecionada++;
        else {
            if (this._opcaoSelecionada == max)
                return 0;
            return this._opcaoSelecionada + 1;
        }
        this._opcaoSelecionada = Math.min(this._opcaoSelecionada, max);
        this._opcaoSelecionada = Math.max(this._opcaoSelecionada, min);
        return -1;
        // let opcao: number = obterNumeroInteiro("Opcao: ");
        // while (opcao < 0 || opcao > opcoes.length) {
        //     exibirTexto("Opcao inválida. Tente novamente.");
        //     opcao = this.obterOpcao();
        // }
        // return opcao;
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
        (0, viewUtils_1.exibirTextoNoCentro)("[Z-X] - movimentar, [C-Espaço] - confirmar");
        // O menu exibido será o menu 
        const menuParaExibir = this.obterMenuParaExibir();
        for (let i = 0; i < menuParaExibir.length; i++) {
            let selectedStr = (i === this._opcaoSelecionada) ? ">" : "";
            if (i === this._opcaoSelecionada) {
                (0, viewUtils_1.exibirTextoEsquerda)(chalk.bold(`${selectedStr} ${i + 1} - ${menuParaExibir[i][0]}`));
            }
            else {
                (0, viewUtils_1.exibirTextoEsquerda)(`${selectedStr}${i + 1} - ${menuParaExibir[i][0]}`);
            }
        }
        let selectedStr = (this._opcaoSelecionada === menuParaExibir.length) ? ">" : "";
        (0, viewUtils_1.exibirTextoEsquerda)(`${selectedStr}0 - Sair`);
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
        (0, ioUtils_1.enterToContinue)();
    }
    despedida() {
        (0, viewUtils_1.limparTerminal)();
        (0, viewUtils_1.mainBackground)();
        (0, viewUtils_1.saltarLinhas)(Math.floor((0, viewUtils_1.obterAlturaTerminal)() / 2) - 1);
        (0, ioUtils_1.exibirTextoCentralizado)("Obrigado e volte sempre!");
        (0, ioUtils_1.enterToContinue)();
    }
    criarPerfil() {
        (0, viewUtils_1.cabecalhoPrincipal)("Criar Perfil");
        let id = ++this._qntPerfisCriados;
        let nome = (0, ioUtils_1.obterTexto)("Nome: ");
        let tentativas = 0;
        while (this._redeSocial.consultarPerfil(undefined, nome, undefined)) {
            if (tentativas >= 3) {
                (0, ioUtils_1.exibirTexto)("Tente novamente mais tarde.");
                return;
            }
            (0, ioUtils_1.exibirTexto)("Já existe um usuário com esse nome.");
            // Existe perfil com esse nome
            nome = (0, ioUtils_1.obterTexto)("Nome: ");
            tentativas++;
        }
        if (nome.length <= 0) {
            (0, ioUtils_1.exibirTexto)("Cancelando...");
            return;
        }
        tentativas = 0;
        let email;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
            // @TODO: Criar uma outra função para obter o input do usuario, limitando a não inserir caracteres especiais. (basicOptions)
            email = (0, ioUtils_1.obterTexto)("Email: ");
            tentativas = 0;
            while (this._redeSocial.consultarPerfil(undefined, undefined, email)) {
                if (tentativas >= 3) {
                    (0, ioUtils_1.exibirTexto)("Tente novamente mais tarde.");
                    return;
                }
                (0, ioUtils_1.exibirTexto)("Já existe um usuário com esse email.");
            }
            if (email.length <= 0) {
                (0, ioUtils_1.exibirTexto)("Cancelando...");
                return;
            }
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
        // Tentar obter perfil:
        let perfil = this.selecionarPerfil();
        if (perfil === null) {
            (0, ioUtils_1.exibirTexto)("Perfil não encontrado.");
            return;
        }
        if (perfil != null) {
            (0, viewUtils_1.prepararTelaPostagem)(perfil);
            let texto = (0, ioUtils_1.obterTexto)("Texto: ");
            // A data é obtida após escrever a postagem.
            let data = new Date;
            // Identificar se é uma postagem avançada.
            var advanced = texto.includes("#");
            var _postagem;
            if (advanced) {
                // Encontrar hashtags:
                var _hashtags = (0, generalUtils_1.extrairHashtags)(texto);
                // Remover hashtags do texto.
                _postagem = new postagem_1.PostagemAvancada(id, texto, curtidas, descurtidas, data, perfil, _hashtags, 10);
            }
            else {
                _postagem = new postagem_1.Postagem(id, texto, curtidas, descurtidas, data, perfil);
            }
            this._redeSocial.incluirPostagem(_postagem);
            this._qntPostagensCriadas++;
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
    exibirPostagens(postagens, header = "") {
        var _pagina = 0;
        var _postsPorPagina = Math.floor(((0, viewUtils_1.obterAlturaTerminal)() - 10) / 4);
        _postsPorPagina = 4;
        var _totalPaginas = Math.ceil(postagens.length / _postsPorPagina);
        while (_pagina < _totalPaginas) {
            (0, viewUtils_1.cabecalhoPrincipal)(header);
            for (let i = 0; i < _postsPorPagina; i++) {
                var n = _pagina * _postsPorPagina + i;
                if (n >= postagens.length)
                    break;
                var _post = postagens[n];
                (0, ioUtils_1.exibirTexto)(`${_post.data.toUTCString()}`);
                (0, ioUtils_1.exibirTexto)(`${_post.perfil.nome}:`);
                (0, ioUtils_1.exibirTextoPostagem)(`${_post.texto}`);
                var _curtidasStr = `${_post.curtidas} curtidas, ${_post.descurtidas} descurtidas.`;
                if (_post instanceof postagem_1.PostagemAvancada) {
                    // Reduzir views
                    _post.decrementarVisualizacoes();
                    var _viewsStr = `(${_post.visualizacoesRestantes})`;
                    var _n = (0, viewUtils_1.obterLarguraTerminal)() - 2 - _curtidasStr.length - 2 - _viewsStr.length;
                    _curtidasStr += `${' '.repeat(_n)}${_viewsStr}`;
                }
                (0, ioUtils_1.exibirTexto)(_curtidasStr);
                (0, viewUtils_1.exibirTextoNoCentro)("-=-");
                console.log();
            }
            (0, viewUtils_1.exibirTextoNoCentro)(`Página ${_pagina + 1}/${_totalPaginas}`);
            _pagina++;
            this.salvarPostagens();
            if (_pagina < _totalPaginas) {
                (0, ioUtils_1.enterToContinue)();
            }
        }
    }
    verFeed() {
        let postagens = this._redeSocial.obterPostagens();
        (0, viewUtils_1.cabecalhoPrincipal)("PatroFeed");
        this.exibirPostagens(postagens, "PatroFeed");
    }
    selecionarPerfil() {
        // Exibir de forma sintetizada os perfis disponíveis.
        this.listarPerfisCurto();
        (0, ioUtils_1.exibirTexto)(`${0} - Cancelar`);
        // Inicializar variável que vai guardar o perfil.
        let perfilParaEditar = null;
        // Receber atributo desejado do usuário
        (0, ioUtils_1.exibirTexto)("Qual perfil? (ID/Nome/Email)");
        let atributoDesejado = (0, ioUtils_1.obterTexto)("");
        if (String(atributoDesejado) === '0' || String(atributoDesejado) === '') {
            (0, ioUtils_1.exibirTexto)("Cancelando...");
            return;
        }
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
        return perfilParaEditar;
    }
    editarPerfis() {
        (0, viewUtils_1.cabecalhoPrincipal)("Editar Perfis");
        // Qual perfil será editado:
        let perfilParaEditar = this.selecionarPerfil();
        // Cancelando:
        if (perfilParaEditar === undefined) {
            return;
        }
        // Não encontramos o perfil:
        if (perfilParaEditar === null) {
            // Perfil não encontrado.
            (0, ioUtils_1.exibirTexto)(`Não encontramos um perfil com esse atributo.`);
            return;
        }
        (0, ioUtils_1.exibirTexto)(`Vamos então editar o perfil: ${perfilParaEditar.nome}`);
        // @TODO: Completar
        // 1 - Encontrar indice do perfil no array this._redeSocial.obterPerfis() --- lembrando que os perfis ficam em Repositorio de Perfis
        var novoNome = (0, ioUtils_1.obterTexto)("Novo nome: ");
        if (novoNome.length <= 0)
            novoNome = perfilParaEditar.nome;
        var novoEmail = (0, ioUtils_1.obterTexto)("Novo email: ");
        if (novoEmail.length <= 0)
            novoEmail = perfilParaEditar.email;
        var _sucess = 0;
        if (novoNome != perfilParaEditar.nome)
            _sucess += 1;
        if (novoEmail != perfilParaEditar.email)
            _sucess += 2;
        var _successString = ``;
        switch (_sucess) {
            case 0:
                _successString = `Cancelando...`;
                break;
            case 1:
                _successString = `Nome alterado com sucesso.`;
                break;
            case 1:
                _successString = `Email alterado com sucesso.`;
                break;
            case 1:
                _successString = `Nome e email alterados com sucesso.`;
                break;
        }
        // Cria um novo array de perfis sem o perfil editado.
        var perfis = this._redeSocial.obterPerfis().filter((p) => {
            if (perfilParaEditar)
                return (p.id != perfilParaEditar.id);
            return false;
        });
        var novoPerfil = new perfil_1.Perfil(perfilParaEditar.id, novoNome, novoEmail);
        perfis.push(novoPerfil);
        this._redeSocial.atribuirPerfisCarregados(perfis);
        this.salvarPerfis();
        (0, ioUtils_1.exibirTexto)(_successString);
    }
    exibirPostagensPorPerfil() {
        (0, viewUtils_1.cabecalhoPrincipal)("Exibir Postagens por Perfil");
        let perfil = this.selecionarPerfil();
        // Cancelando:
        if (perfil == undefined) {
            return;
        }
        // Perfil não encontrado.
        if (perfil == null) {
            (0, ioUtils_1.exibirTexto)(`Não encontramos um perfil com esse atributo.`);
            return;
        }
        (0, ioUtils_1.exibirTexto)(`Exibindo postagens de ${perfil.nome}`);
        let postagensDoPerfil = this._redeSocial.obterPostagens().filter((p) => {
            if (perfil != null) {
                return p.perfil.id == perfil.id;
            }
            return false;
        });
        // Se não houver postagens:
        if (postagensDoPerfil.length <= 0) {
            (0, viewUtils_1.exibirTextoNoCentro)(`Não há postagens do perfil ${perfil.nome}.`);
            return;
        }
        // Com as postagens do perfil específico:
        this.exibirPostagens(postagensDoPerfil, `Postagens de ${perfil.nome}:`);
    }
    exibirPostagensPorHashtag() {
        (0, viewUtils_1.cabecalhoPrincipal)("Exibir Postagens por Hashtag");
        let hashtag = (0, ioUtils_1.obterTexto)("Hashtag: ");
        // Cancelando:
        if (hashtag.length <= 0) {
            (0, ioUtils_1.exibirTexto)("Cancelando...");
            return;
        }
        // Procurar por todas as postagens.
        let postagens = this._redeSocial.obterPostagens();
        // Ver quais possuem a hashtag desejada
        let postagensFiltradas = postagens.filter((p) => {
            if (p instanceof postagem_1.PostagemAvancada) {
                return p.existeHashtag(hashtag);
            }
        });
        if (postagensFiltradas.length <= 0) {
            (0, ioUtils_1.exibirTexto)("Não há postagens com essa hashtag.");
            return;
        }
        this.exibirPostagens(postagensFiltradas, `Postagens com Hashtag "#${hashtag}":`);
    }
    excluirPerfil() {
        (0, viewUtils_1.cabecalhoPrincipal)("Excluir Perfil");
        let perfil = this.selecionarPerfil();
        // Cancelando:
        if (perfil == undefined) {
            return;
        }
        // Perfil não encontrado.
        if (perfil == null) {
            (0, ioUtils_1.exibirTexto)(`Não encontramos um perfil com esse atributo.`);
            return;
        }
        // Gerar um novo array de perfis que não contém o perfil escolhido.
        let novosPerfis = this._redeSocial.obterPerfis().filter((p) => {
            return (p != perfil);
        });
        this._redeSocial.atribuirPerfisCarregados(novosPerfis);
        this.salvarPerfis();
    }
    executar() {
        // Checar tamanho da janela
        if ((0, viewUtils_1.obterLarguraTerminal)() < 64) {
            (0, viewUtils_1.mainBackground)();
            (0, viewUtils_1.saltarLinhas)(Math.floor((0, viewUtils_1.obterAlturaTerminal)() / 2 - 3));
            (0, ioUtils_1.exibirTextoPostagem)("Por favor, ajuste o tamanho da janela do terminal antes de executar a aplicação.");
            (0, ioUtils_1.enterToContinue)();
            return;
        }
        // Tela de início
        this.wakeUpScreen();
        (0, ioUtils_1.enterToContinue)();
        // Menu:
        let opcao = -1;
        while (opcao != 0) {
            (0, viewUtils_1.limparTerminal)();
            this.exibirMenu();
            opcao = this.obterOpcao();
            // console.log("opção: " + String(opcao)); enterToContinue();
            if (opcao >= 0) {
                this.executarOpcao(opcao);
            }
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
