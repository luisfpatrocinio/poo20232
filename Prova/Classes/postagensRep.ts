import { Postagem, PostagemAvancada } from "./postagem";
import { Perfil } from "./perfil";

export class RepositorioDePostagens {
    private _postagens = new Array<Postagem>;

    incluir(postagem: Postagem): void {
        this._postagens.push(postagem);
    }

    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Array<Postagem>{      
        // Retornar todas as postagens caso não hajam argumentos (que podem ser exibidas)
        if (arguments.length == 0) {
            return this._postagens.filter((p) => {
                if (p instanceof PostagemAvancada) {
                    return (p.visualizacoesRestantes > 0);
                }
                return true
            })
        }

        if (id === undefined && texto === undefined && perfil === undefined) {
            return this._postagens.filter((p) => {
                if (p instanceof PostagemAvancada) {
                    return (p.visualizacoesRestantes > 0);
                }
                return true
            })
        }
        
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
                    if (!postagensEncontradas.includes(post)) postagensEncontradas.push(post);
                }
            })
        }

        // Obter por hashtag
        if (hashtag != undefined) {
            this._postagens.forEach((post) => {
                if (post instanceof PostagemAvancada) {
                    if (!postagensEncontradas.includes(post)) {
                        if (post.existeHashtag(hashtag)) postagensEncontradas.push(post);
                    }
                }
            });
        }

        // Obter por perfil
        if (perfil != undefined) {
            this._postagens.forEach((post) => {
                if (post.perfil === perfil) {
                    if (!postagensEncontradas.includes(post)) postagensEncontradas.push(post);
                }
            });

        }


        // Precisamos filtrar esse array.
        const postagensFiltradas = postagensEncontradas.filter((post) => {
            // A postagem encontrada pode continuar a menos que conflite com algum outro filtro de pesquisa.
            var _podeEntrar = true;
            if (id != undefined)        {
                if (post.id != id) _podeEntrar = false;
            }
            if (texto != undefined) {
                if (!post.texto.includes(texto)) _podeEntrar = false;
            }
            if (hashtag != undefined) {
                if (post instanceof PostagemAvancada) {
                    if (!post.existeHashtag(hashtag))                       _podeEntrar = false;
                }    
            }
            if (perfil != undefined)    if (post.perfil != perfil)          _podeEntrar = false;

            return _podeEntrar;
        })
        
        // Retornar array de postagens que se adequem aos filtros especificados, ainda que seja um array vazio.
        // Porém, apenas as que ainda podem ser exibidas.
        return postagensFiltradas.filter((p) => {
            if (p instanceof PostagemAvancada) {
                return (p.visualizacoesRestantes > 0);
            }
            return true
        });
    }

    get postagens(): Array<Postagem> {
        return this.postagens;
    }

    set postagens(novasPostagens: Array<Postagem>) {
        this._postagens = novasPostagens;
    }
}