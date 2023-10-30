// Classe Perfil
class Perfil {
    private _id: number;
    private _nome: string;
    private _email: string;

    constructor(_id: number, _nome: string, _email: string) {
        this._id = _id;
        this._nome = _nome;
        this._email = _email;
    }

    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    get email() {
        return this._email;
    }
}

// Classe Postagem
class Postagem {
    private _id: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date;
    private _perfil: Perfil;

    constructor(_id: number, _texto: string, _curtidas: number, _descurtidas: number, _data: Date, _perfil: Perfil) {
        this._id = _id;
        this._texto = _texto;
        this._curtidas = _curtidas;
        this._descurtidas = _descurtidas;
        this._data = _data;
        this._perfil = _perfil;
    }

    get id() {
        return this._id;
    }

    get texto() {
        return this._texto;
    }

    get curtidas() {
        return this._curtidas;
    }

    get descurtidas() {
        return this._descurtidas;
    }

    get data() {
        return this._data;
    }

    get perfil() {
        return this._perfil;
    }

    curtir(): void {
        this._curtidas++;
        return
    }

    descurtir(): void {
        this._descurtidas++;
        return
    }

    ehPopular(): boolean {
        // Retorna true caso a quantidade de curtidas seja 50% maior que a quantidade de descurtidas.
        return this._curtidas > 1.5 * this._descurtidas;
    }
}

// Classe Postagem Avançada
class PostagemAvancada extends Postagem {
    private _hashtags: Array<string>;
    private _visualizacoesRestantes: number;

    constructor(_id: number, _texto: string, _curtidas: number, _descurtidas: number, _data: Date, _perfil: Perfil, _hashtags: Array<string>, _visualizacoesRestantes: number) {
        super(_id, _texto, _curtidas, _descurtidas, _data, _perfil);
        this._hashtags = _hashtags;
        this._visualizacoesRestantes = _visualizacoesRestantes;
    }

    get visualizacoesRestantes() {
        return this._visualizacoesRestantes;
    }

    adicionarHashtag(hashtag: string): void {
        this._hashtags.push(hashtag);
        return
    }

    existeHashtag(hashtag: string): boolean {
        for (let i = 0; i < this._hashtags.length; i++) {
            if (this._hashtags[i] == hashtag) {
                return true;
            }
        }
        return false;
    }
    
    decrementarVisualizacoes(): void {
        this._visualizacoesRestantes--;
    }
}

// Classe Repositorio de Perfis
class RepositorioDePerfis {
    private _perfis: Array<Perfil> = new Array<Perfil>;
    
    incluir(perfil: Perfil): void {
        this._perfis.push(perfil);
    }

    consultar(id?: number, nome?: string, email?: string): Perfil | null {
        // Encerrar caso não hajam argumentos
        if (arguments.length == 0) return null;

        if (id !== undefined) {
            const perfilPorId = this._perfis.find((p) => p.id === id);
            if (perfilPorId) return perfilPorId;
        }

        if (nome != undefined) {
            const perfilPorNome = this._perfis.find((p) => p.nome === nome);
            if (perfilPorNome) return perfilPorNome;
        }

        if (email != undefined) {
            const perfilPorEmail = this._perfis.find((p) => p.email === email);
            if (perfilPorEmail) return perfilPorEmail;
        }

        return null;
    }  
}

// Classe Repositorio de Postagens
class RepositorioDePostagens {
    private _postagens = new Array<Postagem>;

    incluir(postagem: Postagem): void {
        this._postagens.push(postagem);
    }

    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Array<Postagem>{      
        // Retornar um array vazio caso não hajam argumentos.
        if (arguments.length == 0) return new Array<Postagem>;
        
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
            if (id != undefined)        if (post.id != id)          _podeEntrar = false;
            if (texto != undefined)     if (post.texto != texto)    _podeEntrar = false;
            if (hashtag != undefined) {
                if (post instanceof PostagemAvancada) {
                    if (!post.existeHashtag(hashtag))               _podeEntrar = false;
                }    
            }
            if (perfil != undefined)    if (post.perfil != perfil)  _podeEntrar = false;

            return _podeEntrar;
        })
        
        // Retornar array de postagens que se adequem aos filtros especificados, ainda que seja um array vazio.
        return postagensFiltradas
    }
}


// Classe Rede Social
class RedeSocial {
    private _repPostagens: RepositorioDePostagens;
    private _repPerfis: RepositorioDePerfis;

    incluirPerfil(perfil: Perfil): void {
        // @TODO: Checar se todos os atributos estão preenchidos.

        // Checar se o perfil já existe
        var _existe = this._repPerfis.consultar(perfil.id, perfil.nome, perfil.email);
        if (_existe === null) {
            this._repPerfis.incluir(perfil);
        }
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil | null {
        return this._repPerfis.consultar(id, nome, email);
    }

    incluirPostagem(postagem: Postagem): void {
        // @TODO: Checar se já não existe uma postagem com mesmo id e que todos os atributos estejam preenchidos.
        this._repPostagens.incluir(postagem);
    }

    consultarPostagens(id: number, texto: string, hashtag: string, perfil: Perfil): Array<Postagem> {
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
}