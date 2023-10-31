// Importar bibliotecas principais:
import {question} from 'readline-sync';
import {Perfil} from './Classes/perfil';
import {Postagem, PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto, exibirTextoCentralizado, obterTexto, enterToContinue} from './Utils/ioUtils';
import { mainBackground, exibirTextoEsquerda, showBlogLogo, exibirTextoNoCentro, prepararTelaPostagem, limparTerminal, cabecalhoPrincipal } from './Utils/viewUtils';

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
        exibirTextoCentralizado("# Criar Postagem #");

        // Checar se há perfis criados.
        if (this._qntPerfisCriados == 0) {
            exibirTexto("Nenhum perfil encontrado. Crie um perfil antes de criar uma postagem.");
            return;            
        }

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
            this.listarPerfis();
            exibirTexto("0 - Cancelar");

            // Obter ID do perfil:
            idPerfil = obterNumeroInteiro("ID do perfil: ");            

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

    listarPerfis(): void {
        if (this._qntPerfisCriados == 0) {
            exibirTexto("Nenhum perfil encontrado.");
            return;
        }
        this._redeSocial.listarPerfis();
    }

    verFeed(): void {
        exibirTexto("Feed da Rede Social");
        let postagens = this._redeSocial.consultarPostagens(undefined, undefined, undefined, undefined);
        postagens.forEach((post) => {
            exibirTexto(`Postagem ${post.id}, por ${post.perfil.nome}: ${post.texto}`);
            console.log();
        })
    }

    executar(): void {
        let opcao: number = -1;
        while (opcao != 0) {
            limparTerminal();
            exibirTextoCentralizado("Rede Social");
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