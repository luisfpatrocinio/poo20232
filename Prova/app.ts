// Importar bibliotecas principais:
import {question} from 'readline-sync';

import {Perfil} from './Classes/perfil';
import {Postagem, PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto, exibirTextoPostagem, exibirTextoCentralizado, obterTexto, enterToContinue} from './Utils/ioUtils';
import { mainBackground, exibirTextoEsquerda, showBlogLogo, exibirTextoNoCentro, prepararTelaPostagem, limparTerminal, cabecalhoPrincipal, feedView, obterAlturaTerminal, exibirTextoCentroCentro, saltarLinhas, obterLarguraTerminal } from './Utils/viewUtils';
import { extrairHashtags, sleep } from './Utils/generalUtils';

// Leitura e Gravação de Arquivos
import { readFileSync, writeFile, writeFileSync } from 'fs';


import chalk from 'chalk';
import { obterNumero } from '../utils';
import { type } from 'os';
import { exit } from 'process';

class App {
    private _redeSocial: RedeSocial;

    // Atributos necessários para gerenciar os IDs dos perfis e postagens.
    private _qntPerfisCriados: number = 0;
    private _qntPostagensCriadas: number = 0;
    
    private menuOpcoes: Array<[string, () => void, () => boolean]> = [
        // Nome da opção, função a ser executada, condição para habilitar a opção
        ["Criar Perfil",    this.criarPerfil,   () => true],
        ["Listar Perfis",   this.listarPerfis,  () => this._redeSocial.obterPerfis().length > 0],
        ["Editar Perfis",   this.editarPerfis,  () => this._redeSocial.obterPerfis().length > 0],
        ["Excluir Perfil",  this.excluirPerfil, () => this._redeSocial.obterPerfis().length > 0],
        ["Criar Postagem",  this.criarPostagem, () => this._redeSocial.obterPerfis().length > 0],
        ["Ver Feed",        this.verFeed,       () => this._redeSocial.obterPostagens().length > 0],
        ["Exibir Postagens por Perfil", this.exibirPostagensPorPerfil,  () => this._redeSocial.obterPostagens().length > 0 && this._redeSocial.obterPerfis().length > 0],
        ["Exibir Postagens por Hashtag", this.exibirPostagensPorHashtag,    () => this._redeSocial.obterPostagens().length > 0]
    ]

    private _opcaoSelecionada : number = 0;

    constructor() {
        this._redeSocial = new RedeSocial;

        try {
            // Carregar Arquivos caso hajam.
            this.carregarPerfis();
            this.carregarPostagens();
        } catch (erro) {
            // Iniciando pela primeira vez.
            mainBackground();
            exibirTextoCentralizado("Iniciando pela primeira vez.");
            enterToContinue();
        }
    }

    wakeUpScreen(): void {
        mainBackground();
        saltarLinhas(Math.floor(obterAlturaTerminal()/2) - 3);
        showBlogLogo();
        var _qntPerfis = this._redeSocial.obterPerfis().length;
        if (_qntPerfis > 0)     exibirTextoCentralizado(`${_qntPerfis} perfis carregados`);
        var _qntPostagens = this._redeSocial.obterPostagens().length;
        if (_qntPostagens > 0)  exibirTextoCentralizado(`${_qntPostagens} postagens carregadas`);
    }

    // Funções de Salvar e Carregar
    salvarPerfis(): void {
        let saveString = "";
        var _perfis = this._redeSocial.obterPerfis();
        saveString += `perfisCriados:${this._qntPerfisCriados}\n`;
        for (let i = 0; i < _perfis.length; i++) {
            var _perfil: Perfil | null = _perfis[i];
            if (_perfil != null) {
                saveString += `${_perfil.id}|${_perfil.nome}|${_perfil.email}\n`;
            }
        }
        const file = writeFileSync("savePerfis.txt", saveString)
    }

    carregarPerfis(): void {
        // Ler Arquivos
        let perfis = new Array<Perfil>;
        let perfisString = new Array<String>;
        try {
            // Ler arquivo de perfis "savePerfis.txt"
            let _conteudo = readFileSync("savePerfis.txt", "utf-8").split("\n");

            // Percorrer conteudo e adicionar aos perfis
            if (_conteudo.length > 0) this._qntPerfisCriados = Number(_conteudo[0].split(":")[1]);

            for (let i = 1; i < _conteudo.length; i++) {
                if (_conteudo[i] != "") {
                    perfisString.push(_conteudo[i]);
                }
            }

            // Para cada linha do arquivo
            for (let i = 0; i < perfisString.length; i++) {
                if (perfisString[i] != "") {
                    // Separar o id e o nome
                    let _perfil: Array<string> = perfisString[i].split("|");
                    // Criar um registro com id e nome
                    let _cadastroPerfil = new Perfil(Number(_perfil[0]), _perfil[1], _perfil[2])
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
            var p: Postagem | PostagemAvancada = _postagens[i];
            var _isAdvanced = p instanceof PostagemAvancada;
            var _adv = String(Number(_isAdvanced));

            // Tratamentos em caso de postagem avançada:
            var _hashtagsString = "";
            var _views = "";
            if (p instanceof PostagemAvancada) {
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
            saveString += `${p.id}|${_adv}|${p.texto}|${p.curtidas}|${p.descurtidas}|40|${p.perfil.id}|${_hashtagsString}|${_views}\n`
        }

        const file = writeFileSync("savePostagens.txt", saveString)
    }

    carregarPostagens() {
        let postagens = new Array<Postagem | PostagemAvancada>;
        let postagensString = new Array<String>;
        try {
            // Ler arquivo de postagens
            let _conteudo = readFileSync("savePostagens.txt", "utf-8").split("\n");
            if (_conteudo.length > 0) this._qntPostagensCriadas = Number(_conteudo[0].split(":")[1]);

            // Percorrer conteudo e adicionar as postagens
            for (let i = 1; i < _conteudo.length; i++) {
                if (_conteudo[i] != "") {
                    postagensString.push(_conteudo[i]);
                }
            }

            // Para cada postagem em string:
            postagensString.forEach((post) => {
                if (post != "") {   // @TODO: Checar se essa checagem é necessária.
                    // Separar elementos:
                    let _fichaPostagem: Array<string> = post.split("|");

                    // Conferir se é uma postagem avançada:
                    let _advanced = (_fichaPostagem[1] === "1") ? true : false;

                    // Criar um registro com id e nome:
                    let _cadastroPostagem: Postagem | PostagemAvancada;
                    
                    let _perfilID = Number(_fichaPostagem[6]);
                    let _perfil: Perfil | null = this._redeSocial.consultarPerfil(_perfilID, undefined, undefined);
            
                    let _curtidas = Number(_fichaPostagem[3]);
                    let _descurtidas = Number(_fichaPostagem[4]);
                    let _data = new Date(); // @TODO: Pegar a data correta a partir do arquivo.
                    
                    if (_perfil != null) {
                        if (_advanced) {
                            var _hashtags = _fichaPostagem[7].split("¨");
                            var _visualizacoes = Number(_fichaPostagem[8]);
                            _cadastroPostagem = new PostagemAvancada(Number(_fichaPostagem[0]), _fichaPostagem[2], _curtidas, _descurtidas, _data, _perfil, _hashtags, _visualizacoes);
                        } else {
                            _cadastroPostagem = new Postagem(Number(_fichaPostagem[0]), _fichaPostagem[2], _curtidas, _descurtidas, _data, _perfil);
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
        } catch (err) {
            
        }
    }


    // Solicita uma opção ao usuário.
    obterOpcao(): number {
        var opcoes = this.obterMenuParaExibir();
        var min = 0;
        var max = opcoes.length;    // A opção máxima é 1 a mais, porque ainda tem a opção SAIR.
        var rsync = require('readline-sync');

        var key = rsync.keyIn('', {
            hideEchoBack: true, 
            mask: '', 
            limit: 'zxc ',
            hideCursor: true,
        });
        if (key == 'z') this._opcaoSelecionada--;
        else if (key == 'x') this._opcaoSelecionada++;
        else {  
            if (this._opcaoSelecionada == max) return 0
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

    obterMenuParaExibir(): Array<[string, () => void, () => boolean]> {
        var menu = new Array<[string, () => void, () => boolean]>;

        // Filtramos o menu, para mostrar apenas as opções que satisfaçam a função no índice 2.
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            var opt = this.menuOpcoes[i];
            if (opt[2]()) {
                menu.push(opt); 
            }
        }
        return menu;
    }

    exibirMenu(): void {
        mainBackground();
        showBlogLogo();
        exibirTextoNoCentro("~ Menu Principal ~");
        exibirTextoNoCentro("[Z-X] - movimentar, [C-Espaço] - confirmar");
    
        // O menu exibido será o menu 
        const menuParaExibir = this.obterMenuParaExibir();

        for (let i = 0; i < menuParaExibir.length; i++) {
            let selectedStr = (i === this._opcaoSelecionada) ? ">" : "";
            exibirTextoEsquerda(`${selectedStr}${i+1} - ${menuParaExibir[i][0]}`);
        }
        let selectedStr = (this._opcaoSelecionada === menuParaExibir.length) ? ">" : "";
        exibirTextoEsquerda(`${selectedStr}0 - Sair`);
    }

    executarOpcao(opcao: number): void {
        if (opcao == 0) {
            // Opcção de sair.
            this.despedida();
            return;
        }

        const opcoesValidas = this.obterMenuParaExibir();
        let funcao = opcoesValidas[opcao-1][1];
        funcao.call(this);
        enterToContinue();
        this._opcaoSelecionada = 0;
    }

    despedida(): void {
        limparTerminal();
        mainBackground();
        saltarLinhas(Math.floor(obterAlturaTerminal()/2) - 1);
        exibirTextoCentralizado("Obrigado e volte sempre!");
        enterToContinue();
    }

    criarPerfil(): void {
        cabecalhoPrincipal("Criar Perfil");

        let id: number = ++this._qntPerfisCriados;
        let nome: string = obterTexto("Nome: ");

        if (nome.length <= 0) {
            exibirTexto("Cancelando...");
            return;
        }

        let email: string;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
            // @TODO: Criar uma outra função para obter o input do usuario, limitando a não inserir caracteres especiais. (basicOptions)
            email = obterTexto("Email: ");
        } while (!email.includes("@") || !email.includes("."));
        let perfil: Perfil = new Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
        exibirTextoNoCentro(`Perfil ${nome} criado com sucesso.`);
        exibirTextoNoCentro(`ID: ${id}`);
        this.salvarPerfis();
    }

    criarPostagem(): void {
        cabecalhoPrincipal("Criar Postagem");

        let id: number = this._qntPostagensCriadas + 1;
        let curtidas: number = 0;
        let descurtidas: number = 0;
        
        // Tentar obter perfil:
        let perfil: void | Perfil | null = this.selecionarPerfil();
        
        if (perfil === null) {
            exibirTexto("Perfil não encontrado.");
            return;
        }

        if (perfil != null) {
            prepararTelaPostagem(perfil);
            let texto: string = obterTexto("Texto: ");
            
            // A data é obtida após escrever a postagem.
            let data: Date = new Date;  

            // Identificar se é uma postagem avançada.
            var advanced = texto.includes("#");

            var _postagem: Postagem;
            if (advanced) {
                // Encontrar hashtags:
                var _hashtags = extrairHashtags(texto);

                // Remover hashtags do texto.
                _postagem = new PostagemAvancada(id, texto, curtidas, descurtidas, data, perfil, _hashtags, 500);
            } else {
                _postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            }
            this._redeSocial.incluirPostagem(_postagem);
            this._qntPostagensCriadas++;
            
            exibirTextoNoCentro(`Postagem No ${id} criada com sucesso.`);
            console.log(_postagem);
            enterToContinue();
        }

        this.salvarPostagens();
    }

    listarPerfisCurto(): void {
        let perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < perfis.length; i++) {
            var _perfil: Perfil = perfis[i];
            exibirTexto(`${_perfil.id} - ${_perfil.nome}`);
        }

        if (perfis.length == 0) {
            exibirTexto("Nenhum perfil encontrado.");
        }
    }

    listarPerfis(): void {
        cabecalhoPrincipal("Perfis Cadastrados");
        let perfis = this._redeSocial.obterPerfis();
        // @TODO: Limitar exibições por página, semelhante a função verFeed
        for (let i = 0; i < perfis.length; i++) {
            var _p = perfis[i];
            exibirTexto(`ID ${_p.id}:`);
            exibirTexto(`Nome: ${_p.nome}`);
            exibirTexto(`Email: ${_p.email}`);
            exibirTextoNoCentro(`x`);
            console.log();
        }
    }

    exibirPostagens(postagens: Array<Postagem>): void {
        var _pagina = 0;
        var _postsPorPagina = Math.floor((obterAlturaTerminal() - 10) / 4);
        _postsPorPagina = 4;
        var _totalPaginas = Math.ceil(postagens.length/_postsPorPagina);

        while (_pagina < _totalPaginas) {
            
            for (let i = 0; i < _postsPorPagina; i++) {
                var n = _pagina * _postsPorPagina + i;

                if (n >= postagens.length) break;

                var _post = postagens[n];
                
                exibirTexto(`${_post.data.toUTCString()}`)
                exibirTexto(`${_post.perfil.nome}:`)
                exibirTextoPostagem(`${_post.texto}`);

                var _curtidasStr = `${_post.curtidas} curtidas, ${_post.descurtidas} descurtidas.`;
                if (_post instanceof PostagemAvancada) {
                    // Reduzir views
                    _post.decrementarVisualizacoes();

                    var _viewsStr = `(${_post.visualizacoesRestantes})`;
                    var _n = obterLarguraTerminal() - 2 - _curtidasStr.length - 2 - _viewsStr.length;
                    _curtidasStr += `${' '.repeat(_n)}${_viewsStr}`;
                }
                exibirTexto(_curtidasStr);
                
                exibirTextoNoCentro("-=-");
                console.log();
            }

            exibirTextoNoCentro(`Página ${_pagina + 1}/${_totalPaginas}`)
            
            _pagina++;
            this.salvarPostagens();
            if (_pagina < _totalPaginas) enterToContinue();
        }
    }

    verFeed(): void {
        let postagens = this._redeSocial.obterPostagens();
        cabecalhoPrincipal("PatroFeed");
        this.exibirPostagens(postagens);
    }

    selecionarPerfil(): void | null | Perfil {
        // Exibir de forma sintetizada os perfis disponíveis.
        this.listarPerfisCurto();
        exibirTexto(`${0} - Cancelar`);
        
        // Inicializar variável que vai guardar o perfil.
        let perfilParaEditar: Perfil | null = null;    
        
        // Receber atributo desejado do usuário
        exibirTexto("Qual perfil? (ID/Nome/Email)")
        let atributoDesejado: string | number = obterTexto("");

        if (String(atributoDesejado) === '0' || String(atributoDesejado) === '') {
            exibirTexto("Cancelando...");
            return;
        }

        // O valor inserido é um número? Se sim, deve ser tratado como ID.
        if (!isNaN(Number(atributoDesejado))) {
            perfilParaEditar = this._redeSocial.consultarPerfil(Number(atributoDesejado), undefined, undefined);
        } else if (typeof(atributoDesejado) == "string") {
            // Verificar se é email:
            if (atributoDesejado.includes("@") && atributoDesejado.includes(".")) {
                perfilParaEditar = this._redeSocial.consultarPerfil(undefined, undefined, atributoDesejado);
            } else {
                // Atributo desejado é nome:
                perfilParaEditar = this._redeSocial.consultarPerfil(undefined, atributoDesejado, undefined);
            }
        }

        return perfilParaEditar;
    }

    editarPerfis(): void {
        cabecalhoPrincipal("Editar Perfis");

        // Qual perfil será editado:
        let perfilParaEditar: void | Perfil | null = this.selecionarPerfil();    
        
        // Cancelando:
        if (perfilParaEditar == undefined) {
            return
        }

        // Não encontramos o perfil:
        if (perfilParaEditar == null) {
            // Perfil não encontrado.
            exibirTexto(`Não encontramos um perfil com esse atributo.`);
            return
        }

        exibirTexto(`Vamos então editar o perfil: ${perfilParaEditar.nome}`);

        // @TODO: Completar
        // 1 - Encontrar indice do perfil no array this._redeSocial.obterPerfis() --- lembrando que os perfis ficam em Repositorio de Perfis
        // 2 - Pedir novo nome e email
        // 3 - Sobreescrever array do repositorio de perfis.
    }

    exibirPostagensPorPerfil() {
        cabecalhoPrincipal("Exibir Postagens por Perfil");
        let perfil: void | Perfil | null = this.selecionarPerfil();

        // Cancelando:
        if (perfil == undefined) {
            return
        }
        
        // Perfil não encontrado.
        if (perfil == null) {
            exibirTexto(`Não encontramos um perfil com esse atributo.`);
            return
        }

        exibirTexto(`Exibindo postagens de ${perfil.nome}`);

        let postagensDoPerfil = this._redeSocial.obterPostagens().filter((p) => {
            if (perfil != null) {
                return p.perfil.id == perfil.id
            }
            return false
        });

        // Se não houver postagens:
        if (postagensDoPerfil.length <= 0) {
            exibirTextoCentralizado(`Não há postagens do perfil ${perfil.nome}.`);
            return
        }

        // Com as postagens do perfil específico:
        this.exibirPostagens(postagensDoPerfil);
    }

    exibirPostagensPorHashtag() {
        cabecalhoPrincipal("Exibir Postagens por Hashtag");
        let hashtag: string = obterTexto("Hashtag: ");

        // Cancelando:
        if (hashtag.length <= 0) {
            exibirTexto("Cancelando...");
            return
        }

        // Procurar por todas as postagens.
        let postagens = this._redeSocial.obterPostagens();

        // Ver quais possuem a hashtag desejada
        let postagensFiltradas = postagens.filter((p) => {
            if (p instanceof PostagemAvancada) {
                return p.existeHashtag(hashtag);
            }
        });
        
        if (postagensFiltradas.length <= 0) {
            exibirTexto("Não há postagens com essa hashtag.");
            return;
        } 

        cabecalhoPrincipal(`Postagens com Hashtag "#${hashtag}":`);
        this.exibirPostagens(postagensFiltradas);
    }

    excluirPerfil() {
        cabecalhoPrincipal("Excluir Perfil");
        let perfil: void | Perfil | null = this.selecionarPerfil();

        // Cancelando:
        if (perfil == undefined) {
            return
        }

        // Perfil não encontrado.
        if (perfil == null) {
            exibirTexto(`Não encontramos um perfil com esse atributo.`);
            return
        }

        // Gerar um novo array de perfis que não contém o perfil escolhido.
        let novosPerfis = this._redeSocial.obterPerfis().filter((p) => {
            return (p != perfil);
        })

        this._redeSocial.atribuirPerfisCarregados(novosPerfis);
        this.salvarPerfis();
    }

    executar(): void {
        // Checar tamanho da janela
        if (obterLarguraTerminal() < 64) {
            mainBackground();
            saltarLinhas(Math.floor(obterAlturaTerminal()/2 - 3));
            exibirTextoPostagem("Por favor, ajuste o tamanho da janela do terminal antes de executar a aplicação.");
            enterToContinue();
            return
        }

        // Tela de início
        this.wakeUpScreen();
        enterToContinue();

        // Menu:
        let opcao: number = -1;
        while (opcao != 0) {
            limparTerminal();
            this.exibirMenu();
            opcao = this.obterOpcao();
            // console.log("opção: " + String(opcao)); enterToContinue();
            if (opcao >= 0) {
                this.executarOpcao(opcao);
            }            
        }
        
        limparTerminal();
        exibirTextoCentralizado("=== FIM ===");
    }
}

function main() {
    const app = new App();
    app.executar();
}

main();