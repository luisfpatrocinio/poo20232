import { Perfil } from "./perfil";
import { Postagem, PostagemAvancada } from "./postagem";
import { RepositorioDePerfis } from "./perfisRep";
import { RepositorioDePostagens } from "../postagensRep";
import { exibirTexto } from "../Utils/ioUtils";

export class RedeSocial {
    private _repPostagens: RepositorioDePostagens = new RepositorioDePostagens;
    private _repPerfis: RepositorioDePerfis = new RepositorioDePerfis;

    incluirPerfil(perfil: Perfil): void {
        // @TODO: Checar se todos os atributos estão preenchidos.

        // Checar se o perfil já existe
        var _existe = this._repPerfis.consultar(perfil.id, perfil.nome, perfil.email);
        if (_existe === null) {
            this._repPerfis.incluir(perfil);
        }
    }

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil | null {
        return this._repPerfis.consultar(id, nome, email);
    }

    incluirPostagem(postagem: Postagem): void {
        // @TODO: Checar se já não existe uma postagem com mesmo id e que todos os atributos estejam preenchidos.
        this._repPostagens.incluir(postagem);
    }

    // Retorna todas as postagens caso não haja argumentos
    // @TODO: Na verdade não é bem assim. Conferir.
    consultarPostagens(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Array<Postagem> {
        return this._repPostagens.consultar(id, texto, hashtag, perfil);
    }

    curtir(idPostagem: number): void {
        var _postagens: Array<Postagem> = this._repPostagens.consultar(idPostagem);
        if (_postagens.length > 0) _postagens[0].curtir();
    }

    descurtir(idPostagem: number): void {
        var _postagens: Array<Postagem> = this._repPostagens.consultar(idPostagem);
        if (_postagens.length > 0) _postagens[0].descurtir();
    }

    decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            postagem.decrementarVisualizacoes();
        }
    }

    exibirPostagensPorPerfil(idPerfil: number): Array<Postagem> {
        // Encontrar perfil a partir do ID
        const _perfil = this._repPerfis.consultar(idPerfil);
        if (_perfil === null) return new Array<Postagem>;
        
        // Encontrar postagens a partir do perfil
        const _postagens = this._repPostagens.consultar(undefined, undefined, undefined, _perfil);
        const _postagensFiltradas = new Array<Postagem>;
        
        // Em cada postagem:
        for (let i = 0; i < _postagens.length; i++) {
            var _post = _postagens[i];

            // Essa postagem deverá ser incluída no array.
            var _canPush = true;

            // Se for uma postagem avançada:
            if (_post instanceof PostagemAvancada) {
                // Checar se há visualizações restantes:
                if (_post.visualizacoesRestantes <= 0) _canPush = false;

                // Decrementar visualizações
                this.decrementarVisualizacoes(_post);
            }

            if (_canPush) _postagensFiltradas.push(_post);
        }
        
        return _postagensFiltradas;
    }

    exibirPostagensPorHashtag(hashtag: string): Array<PostagemAvancada> {
        // Obter todas as postagens que possuem essa hashtag
        const _postagens = this._repPostagens.consultar(undefined, undefined, hashtag, undefined);

        // Array vazio que será alimentado e retornado
        const _postagensFiltradas = new Array<PostagemAvancada>;
        
        // Em cada postagem:
        for (let i = 0; i < _postagens.length; i++) {
            var _post = _postagens[i];
            if (_post instanceof PostagemAvancada) {
                // Checar se há visualizações restantes:
                var _canPush = (_post.visualizacoesRestantes > 0);

                // Decrementar visualizações
                this.decrementarVisualizacoes(_post);
                
                // Adicionar ao array.
                if (_canPush) _postagensFiltradas.push(_post);
            }
        }

        return _postagensFiltradas;
    }

    obterPerfis(): Array<Perfil> {
        return this._repPerfis.perfis;
    }

    obterPostagens(): Array<Postagem> {
        // Retorna todas as postagens.
        return this._repPostagens.consultar();
    }
}