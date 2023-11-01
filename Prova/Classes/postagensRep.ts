import { Postagem, PostagemAvancada } from "./postagem";
import { Perfil } from "./perfil";

export class RepositorioDePostagens {
    private _postagens = new Array<Postagem>;

    incluir(postagem: Postagem): void {
        this._postagens.push(postagem);
    }

    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Array<Postagem>{      
        // Retornar todas as postagens caso não hajam argumentos
        // @TODO: Isso não funciona qunado usamos 4 argumentos undefineds, por exemplo. Precisamos rever.
        if (arguments.length == 0) return this._postagens
        
        const postagensEncontradas = new Array<Postagem>;

        if (id != undefined) {
            const postagemPorId = this._postagens.find((p) => p.id === id);
            if (postagemPorId) {
                postagensEncontradas.push(postagemPorId);
            }
        }

        // Obter por Texto:
        if (texto != undefined) {
            this._postagens.forEach((post) => {
                if (post.texto.includes(texto)) {
                    postagensEncontradas.push(post);
                }
            })
        }

        // Obter por hashtag
        if (hashtag != undefined) {
            this._postagens.forEach((post) => {
                if (post instanceof PostagemAvancada) {
                    if (post.existeHashtag(hashtag)) postagensEncontradas.push(post);
                }
            });
        }

        // Obter por perfil
        if (perfil != undefined) {
            this._postagens.forEach((post) => {
                if (post.perfil === perfil) {
                    postagensEncontradas.push(post);
                }
            });

        }


        // Precisamos filtrar esse array.
        const postagensFiltradas = postagensEncontradas.filter((post) => {
            // A postagem encontrada pode continuar a menos que conflite com algum outro filtro de pesquisa.
            var _podeEntrar = true;
            if (id != undefined)        if (post.id != id)                  _podeEntrar = false;
            if (texto != undefined)     if (post.texto.includes(texto))     _podeEntrar = false;
            if (hashtag != undefined) {
                if (post instanceof PostagemAvancada) {
                    if (!post.existeHashtag(hashtag))                       _podeEntrar = false;
                }    
            }
            if (perfil != undefined)    if (post.perfil != perfil)          _podeEntrar = false;

            return _podeEntrar;
        })
        
        // Retornar array de postagens que se adequem aos filtros especificados, ainda que seja um array vazio.
        return postagensFiltradas
    }

    get postagens(): Array<Postagem> {
        return this.postagens;
    }

    set postagens(novasPostagens: Array<Postagem>) {
        this._postagens = novasPostagens;
    }
}