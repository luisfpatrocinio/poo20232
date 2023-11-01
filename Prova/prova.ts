// Importar bibliotecas principais:
import {question} from 'readline-sync';
import {Perfil} from './Classes/perfil';
import {Postagem, PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto, exibirTextoCentralizado, obterTexto, enterToContinue} from './Utils/ioUtils';
import { mainBackground, exibirTextoEsquerda, showBlogLogo, exibirTextoNoCentro, prepararTelaPostagem, limparTerminal, cabecalhoPrincipal, feedView, obterAlturaTerminal, exibirTextoCentroCentro } from './Utils/viewUtils';

// Leitura e Gravação de Arquivos
import { readFileSync, writeFile, writeFileSync } from 'fs';


import chalk from 'chalk';
import { obterNumero } from '../utils';
import { type } from 'os';

class App {
    private _redeSocial: RedeSocial;
    private _qntPerfisCriados: number = 0;
    private _qntPostagensCriadas: number = 0;
    // @TODO: Essa quantidade deve ser salva em arquivo, para que não seja perdida ao reiniciar o programa.
    private menuOpcoes: Array<[string, () => void, () => boolean]> = [
        // Nome da opção, função a ser executada, condição para habilitar a opção
        ["Criar Perfil", this.criarPerfil, () => true],
        ["Criar Postagem", this.criarPostagem, () => this._qntPerfisCriados > 0],
        ["Listar Perfis", this.listarPerfis, () => this._qntPerfisCriados > 0],
        ["Ver Feed", this.verFeed, () => this._qntPostagensCriadas > 0],
        ["Editar Perfis", this.editarPerfis, () => this._qntPerfisCriados > 0],


    ]

    constructor() {
        this._redeSocial = new RedeSocial;

        // Ler arquivo:
        try {
            const file = readFileSync('savePerfis.txt', 'utf-8');
            this.carregarPerfis();

            mainBackground();
            for (let i = 0; i < Math.floor(obterAlturaTerminal()/2); i++) {
                console.log();
            }
            exibirTextoCentralizado(`CARREGANDO PATROBLOG`);
            exibirTextoCentralizado(`${this._qntPerfisCriados} perfis carregados`);
            enterToContinue();
        } catch (erro) {
            // Iniciando pela primeira vez.
            exibirTextoCentroCentro("Iniciando pela primeira vez.");
            mainBackground();
            writeFileSync("savePerfis.txt", "oi");
        }
    }

    salvarPerfis(): void {
        let saveString = "";
        var _perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < _perfis.length; i++) {
            var _perfil: Perfil | null = _perfis[i];
            if (_perfil != null) {
                saveString += `${_perfil.id}#${_perfil.nome}#${_perfil.email}\n`;
            }
        }
        const file = writeFileSync("savePerfis.txt", saveString)
    }

    carregarPerfis(): void {
        // Ler Arquivos
        let perfis = new Array<Perfil>;
        let perfisString = new Array<String>;
        try {
            // Ler arquivo de montadoras "montadoras.txt"
            let _conteudo = readFileSync("savePerfis.txt", "utf-8").split("\n");

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
                    let _perfil: Array<string> = perfisString[i].split("#");
                    // Criar um registro com id e nome
                    let _cadastroPerfil = new Perfil(Number(_perfil[0]), _perfil[1], _perfil[2])
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

    // Solicita uma opção ao usuário.
    obterOpcao(): number {
        let opcao: number = obterNumeroInteiro("Opcao: ");
        while (opcao < 0 || opcao > this.menuOpcoes.length) {
            exibirTexto("Opcao inválida. Tente novamente.");
            opcao = this.obterOpcao();
        }
        return opcao;
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
    
        // O menu exibido será o menu 
        const menuParaExibir = this.obterMenuParaExibir();

        for (let i = 0; i < menuParaExibir.length; i++) {
            exibirTextoEsquerda(`${i+1} - ${menuParaExibir[i][0]}`);
        }
        exibirTextoEsquerda("0 - Sair");
    }

    executarOpcao(opcao: number): void {
        if (opcao == 0) return;
        const opcoesValidas = this.obterMenuParaExibir();
        let funcao = opcoesValidas[opcao-1][1];
        funcao.call(this);
    }

    criarPerfil(): void {
        cabecalhoPrincipal("Criar Perfil");

        let id: number = ++this._qntPerfisCriados;
        let nome: string = obterTexto("Nome: ");
        let email: string;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
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
        let data: Date = new Date;  // Obter data atual do sistema
        
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil: Perfil | null = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            // Listar perfis.
            this.listarPerfisCurto();
            exibirTexto("0 - Cancelar");

            // Obter ID do perfil:
            idPerfil = obterNumeroInteiro("ID do perfil: "); 
            
            // Optou por sair:
            if (idPerfil == 0) {
                exibirTexto("Cancelando...");
                return;
            }

            perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
            if (perfil === null) {
                exibirTexto("Perfil não encontrado.");
                idPerfil = -1; // Voltando a -1, faz permanecer no ciclo.
                tentativasDeEncontrarPerfil++;
            }

            // Porém, se esgotar 3 tentativas, é melhor abortar a criação de postagem.
            if (tentativasDeEncontrarPerfil > 3) {
                exibirTexto("Tente novamente mais tarde.")
                return;
            }
        }

        // Perfil encontrado, continuar a criação da postagem.
        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            prepararTelaPostagem(perfil);
            let texto: string = question("Texto: ");
            var _postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            this._qntPostagensCriadas++;1
            
            exibirTextoNoCentro(`Postagem No ${id} criada com sucesso.`)
        }

    }

    listarPerfisCurto(): void {
        let perfis = this._redeSocial.obterPerfis();
        for (let i = 0; i < perfis.length; i++) {
            var _perfil: Perfil = perfis[i];
            exibirTexto(`Perfil ${_perfil.id} - ${_perfil.nome}`);
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

    verFeed(): void {
        let postagens = this._redeSocial.obterPostagens();
        var _pagina = 0;
        var _postsPorPagina = Math.floor((obterAlturaTerminal() - 10) / 4);
        _postsPorPagina = 4;
        var _totalPaginas = Math.ceil(postagens.length/_postsPorPagina);

        while (_pagina < _totalPaginas) {
            feedView();
            for (let i = 0; i < _postsPorPagina; i++) {
                var n = _pagina * _postsPorPagina + i;

                if (n >= postagens.length) break;

                var _post = postagens[n];
                
                exibirTexto(`${_post.data.toUTCString()}`)
                exibirTexto(`${_post.perfil.nome}:`)
                exibirTexto(`${_post.texto}`);

                var _curtidasStr = `${_post.curtidas} curtidas, ${_post.descurtidas} descurtidas.`;
                exibirTexto(_curtidasStr);
                
                exibirTextoNoCentro("x");
                console.log();
            }

            exibirTextoNoCentro(`Página ${_pagina + 1}/${_totalPaginas}`)
            
            _pagina++;

            enterToContinue();
        }
    }

    editarPerfis(): void {
        cabecalhoPrincipal("Editar Perfis");

        // Exibir de forma sintetizada os perfis disponíveis.
        this.listarPerfisCurto();

        // Inicializar variável que vai guardar o perfil.
        let perfilParaEditar: Perfil | null = null;    
        
        // Receber atributo desejado do usuário
        exibirTexto("Qual perfil deseja editar? (ID/Nome/Email)")
        let atributoDesejado: string | number = obterTexto("");

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
        
        // Encontramos o perfil:
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

    executar(): void {
        let opcao: number = -1;
        while (opcao != 0) {
            limparTerminal();
            this.exibirMenu();
            opcao = this.obterOpcao();
            this.executarOpcao(opcao);
            enterToContinue();
        }
        exibirTextoCentralizado("=== FIM ===")
    }
}

function main() {
    const app = new App();
    app.executar();
}

main();