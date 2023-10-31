// Importar bibliotecas principais:
import {question} from 'readline-sync';
import {Perfil} from './Classes/perfil';
import {Postagem} from './Classes/postagem';
import {PostagemAvancada} from './Classes/postagem';
import {RedeSocial} from './Classes/redeSocial';

// Importar Utils
import {obterNumeroInteiro, exibirTexto} from './Utils/ioUtils';
class App {
    private _redeSocial: RedeSocial;
    private menuOpcoes: Array<string> = [
        "Criar Perfil",
        "Criar Postagem",
        "Listar Perfis",
        "Ver Feed"
        ]

    constructor() {
        this._redeSocial = new RedeSocial;
    }

    obterOpcao(): number {
        let opcao: number = obterNumeroInteiro("Opção: ");
        while (opcao < 0 || opcao > this.menuOpcoes.length) {
            exibirTexto("Opção inválida. Tente novamente.");
            opcao = this.obterOpcao();
        }
        return opcao;
    }

    exibirOpcoes(): void {
        exibirTexto("--- MENU ---");
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            exibirTexto(`${i+1} - ${this.menuOpcoes[i]}`);
        }
    }

    executarOpcao(opcao: number): void {
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

    criarPerfil(): void {
        exibirTexto("# Criar Perfil");
        let id: number = this._redeSocial.obterQuantidadeDePerfis() + 1;
        let nome: string = question("Nome: ");
        let email: string = question("Email: ");
        let perfil: Perfil = new Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
    }

    criarPostagem(): void {
        exibirTexto("# Criar Postagem");
        let id: number = this._redeSocial.obterQuantidadeDePostagens() + 1;
        let curtidas: number = 0;
        let descurtidas: number = 0;
        let data: Date = new Date;  // Obter data atual do sistema
        
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil: Perfil | null = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            idPerfil = obterNumeroInteiro("ID do perfil: ");

            // Aqui seria interessante listar os perfis, e mostrar a opção 0 - Cancelar.
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
        let texto: string = question("Texto: ");

        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            var _postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            exibirTexto(`Postagem No ${id} criada com sucesso.`)
        }

    }

    listarPerfis(): void {
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
        this.exibirOpcoes();
        let opcao: number = this.obterOpcao();
        while (opcao != 0) {
            this.executarOpcao(opcao);
            opcao = this.obterOpcao();
        }
        console.log("Fim do Programa.")
    }
}

function main() {
    const app = new App();
    app.executar();
}

main();