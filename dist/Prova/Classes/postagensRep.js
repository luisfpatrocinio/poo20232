"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDePostagens = void 0;
const postagem_1 = require("./postagem");
class RepositorioDePostagens {
    constructor() {
        this._postagens = new Array;
    }
    incluir(postagem) {
        this._postagens.push(postagem);
    }
    consultar(id, texto, hashtag, perfil) {
        // Retornar todas as postagens caso não hajam argumentos
        // @TODO: Isso não funciona qunado usamos 4 argumentos undefineds, por exemplo. Precisamos rever.
        if (arguments.length == 0)
            return this._postagens;
        const postagensEncontradas = new Array;
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
            });
        }
        // Obter por hashtag
        if (hashtag != undefined) {
            this._postagens.forEach((post) => {
                if (post instanceof postagem_1.PostagemAvancada) {
                    if (post.existeHashtag(hashtag))
                        postagensEncontradas.push(post);
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
            if (id != undefined)
                if (post.id != id)
                    _podeEntrar = false;
            if (texto != undefined)
                if (post.texto.includes(texto))
                    _podeEntrar = false;
            if (hashtag != undefined) {
                if (post instanceof postagem_1.PostagemAvancada) {
                    if (!post.existeHashtag(hashtag))
                        _podeEntrar = false;
                }
            }
            if (perfil != undefined)
                if (post.perfil != perfil)
                    _podeEntrar = false;
            return _podeEntrar;
        });
        // Retornar array de postagens que se adequem aos filtros especificados, ainda que seja um array vazio.
        return postagensFiltradas;
    }
    // Criei para ser usada na classe RedeSocial
    obterQuantidadeDePostagens() {
        return this._postagens.length;
    }
}
exports.RepositorioDePostagens = RepositorioDePostagens;
