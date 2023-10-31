// Importar bibliotecas principais:
import {question} from 'readline-sync';
import {Perfil} from './Classes/perfil';
import {Postagem, PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto, exibirTextoCentralizado} from './Utils/ioUtils';
import { enterToContinue, limparTerminal } from '../utils';
import { mainBackground, exibirTextoEsquerda, showBlogLogo, exibirTextoNoCentro, prepararTelaPostagem } from './Utils/viewUtils';

class App {
    private _redeSocial: RedeSocial;
    private _qntPerfisCriados: number = 0;
    private _qntPostagensCriadas: number = 0;
    // @TODO: Essa quantidade deve ser salva em arquivo, para que não seja perdida ao reiniciar o programa.
    private menuOpcoes: Array<[string, () => void]> = [
        ["Criar Perfil", this.criarPerfil],
        ["Criar Postagem", this.criarPostagem],
        ["Listar Perfis", this.listarPerfis],
        ["Ver Feed", this.verFeed],

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

    exibirMenu(): void {
        mainBackground();
        showBlogLogo();
        exibirTextoNoCentro("~ Menu Principal ~");
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            exibirTextoEsquerda(`${i+1} - ${this.menuOpcoes[i][0]}`);
        }
        exibirTextoEsquerda("0 - Sair");
    }

    executarOpcao(opcao: number): void {
        if (opcao == 0) return;
        let funcao = this.menuOpcoes[opcao-1][1];
        funcao.call(this);
    }

    criarPerfil(): void {
        exibirTexto("# Criar Perfil");
        let id: number = ++this._qntPerfisCriados;
        let nome: string = question("Nome: ");
        let email: string;
        do {
            // @TODO: Apagar a última linha caso nao tenha sido inserido email válido.
            email = question("Email: ");
        } while (!email.includes("@") || !email.includes("."));
        let perfil: Perfil = new Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
        exibirTexto(`Perfil ${nome} criado com sucesso. ID: ${id}`);
    }

    criarPostagem(): void {
        exibirTextoCentralizado("# Criar Postagem #");

        // Checar se há perfis criados.
        if (this._qntPerfisCriados == 0) {
            exibirTexto("Nenhum perfil encontrado. Crie um perfil antes de criar uma postagem.");
            return;            
        }

        let id: number = ++this._qntPostagensCriadas;
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

        // Perfil encontrado, continuar a criação da postagem:
        prepararTelaPostagem(perfil);
        let texto: string = question("Texto: ");

        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            var _postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            exibirTexto(`Postagem No ${id} criada com sucesso.`)
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