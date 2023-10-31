// Importar bibliotecas principais:
import {question} from 'readline-sync';
import {Perfil} from './Classes/perfil';
import {Postagem, PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto, exibirTextoCentralizado, obterTexto, enterToContinue} from './Utils/ioUtils';
import { mainBackground, exibirTextoEsquerda, showBlogLogo, exibirTextoNoCentro, prepararTelaPostagem, limparTerminal, cabecalhoPrincipal, feedView, obterAlturaTerminal } from './Utils/viewUtils';

import chalk from 'chalk';

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
        ["Editar Perfis", this.editarPerfis, () => this._qntPerfisCriados > 0]

    ]

    constructor() {
        this._redeSocial = new RedeSocial;
    }

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
        let funcao = this.menuOpcoes[opcao-1][1];
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