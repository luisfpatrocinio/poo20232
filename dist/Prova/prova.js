"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Classe Perfil
class Perfil {
    constructor(_id, _nome, _email) {
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
    constructor(_id, _texto, _curtidas, _descurtidas, _data, _perfil) {
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
    curtir() {
        this._curtidas++;
        return;
    }
    descurtir() {
        this._descurtidas++;
        return;
    }
    ehPopular() {
        // Retorna true caso a quantidade de curtidas seja 50% maior que a quantidade de descurtidas.
        return this._curtidas > 1.5 * this._descurtidas;
    }
}
// Classe Postagem Avançada
class PostagemAvancada extends Postagem {
    constructor(_id, _texto, _curtidas, _descurtidas, _data, _perfil, _hashtags, _visualizacoesRestantes) {
        super(_id, _texto, _curtidas, _descurtidas, _data, _perfil);
        this._hashtags = _hashtags;
        this._visualizacoesRestantes = _visualizacoesRestantes;
    }
    get visualizacoesRestantes() {
        return this._visualizacoesRestantes;
    }
    adicionarHashtag(hashtag) {
        this._hashtags.push(hashtag);
        return;
    }
    existeHashtag(hashtag) {
        for (let i = 0; i < this._hashtags.length; i++) {
            if (this._hashtags[i] == hashtag) {
                return true;
            }
        }
        return false;
    }
    decrementarVisualizacoes() {
        this._visualizacoesRestantes--;
    }
}
// Classe Repositorio de Perfis
class RepositorioDePerfis {
    constructor() {
        this._perfis = new Array;
    }
    incluir(perfil) {
        this._perfis.push(perfil);
    }
    consultar(id, nome, email) {
        // Encerrar caso não hajam argumentos
        if (arguments.length == 0)
            return null;
        if (id !== undefined) {
            const perfilPorId = this._perfis.find((p) => p.id === id);
            if (perfilPorId)
                return perfilPorId;
        }
        if (nome != undefined) {
            const perfilPorNome = this._perfis.find((p) => p.nome === nome);
            if (perfilPorNome)
                return perfilPorNome;
        }
        if (email != undefined) {
            const perfilPorEmail = this._perfis.find((p) => p.email === email);
            if (perfilPorEmail)
                return perfilPorEmail;
        }
        return null;
    }
    // Criei para ser usada na classe RedeSocial
    obterQuantidadeDePerfis() {
        return this._perfis.length;
    }
    listarPerfis() {
        for (let i = 0; i < this._perfis.length; i++) {
            let _perfil = this._perfis[i];
            console.log(`Perfil ${_perfil.id} - ${_perfil.nome}`);
        }
    }
}
// Classe Repositorio de Postagens
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
                if (post instanceof PostagemAvancada) {
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
                if (post.texto != texto)
                    _podeEntrar = false;
            if (hashtag != undefined) {
                if (post instanceof PostagemAvancada) {
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
// Classe Rede Social
class RedeSocial {
    constructor() {
        this._repPostagens = new RepositorioDePostagens;
        this._repPerfis = new RepositorioDePerfis;
    }
    incluirPerfil(perfil) {
        // @TODO: Checar se todos os atributos estão preenchidos.
        // Checar se o perfil já existe
        var _existe = this._repPerfis.consultar(perfil.id, perfil.nome, perfil.email);
        if (_existe === null) {
            this._repPerfis.incluir(perfil);
        }
    }
    consultarPerfil(id, nome, email) {
        return this._repPerfis.consultar(id, nome, email);
    }
    incluirPostagem(postagem) {
        // @TODO: Checar se já não existe uma postagem com mesmo id e que todos os atributos estejam preenchidos.
        this._repPostagens.incluir(postagem);
    }
    // Retorna todas as postagens caso não haja argumentos
    consultarPostagens(id, texto, hashtag, perfil) {
        return this._repPostagens.consultar(id, texto, hashtag, perfil);
    }
    curtir(idPostagem) {
        var _postagens = this._repPostagens.consultar(idPostagem);
        if (_postagens.length > 0)
            _postagens[0].curtir();
    }
    descurtir(idPostagem) {
        var _postagens = this._repPostagens.consultar(idPostagem);
        if (_postagens.length > 0)
            _postagens[0].descurtir();
    }
    decrementarVisualizacoes(postagem) {
        if (postagem.visualizacoesRestantes > 0) {
            postagem.decrementarVisualizacoes();
        }
    }
    exibirPostagensPorPerfil(idPerfil) {
        // Encontrar perfil a partir do ID
        const _perfil = this._repPerfis.consultar(idPerfil);
        if (_perfil === null)
            return new Array;
        // Encontrar postagens a partir do perfil
        const _postagens = this._repPostagens.consultar(undefined, undefined, undefined, _perfil);
        const _postagensFiltradas = new Array;
        // Em cada postagem:
        for (let i = 0; i < _postagens.length; i++) {
            var _post = _postagens[i];
            // Essa postagem deverá ser incluída no array.
            var _canPush = true;
            // Se for uma postagem avançada:
            if (_post instanceof PostagemAvancada) {
                // Checar se há visualizações restantes:
                if (_post.visualizacoesRestantes <= 0)
                    _canPush = false;
                // Decrementar visualizações
                this.decrementarVisualizacoes(_post);
            }
            if (_canPush)
                _postagensFiltradas.push(_post);
        }
        return _postagensFiltradas;
    }
    exibirPostagensPorHashtag(hashtag) {
        // Obter todas as postagens que possuem essa hashtag
        const _postagens = this._repPostagens.consultar(undefined, undefined, hashtag, undefined);
        // Array vazio que será alimentado e retornado
        const _postagensFiltradas = new Array;
        // Em cada postagem:
        for (let i = 0; i < _postagens.length; i++) {
            var _post = _postagens[i];
            if (_post instanceof PostagemAvancada) {
                // Checar se há visualizações restantes:
                var _canPush = (_post.visualizacoesRestantes > 0);
                // Decrementar visualizações
                this.decrementarVisualizacoes(_post);
                // Adicionar ao array.
                if (_canPush)
                    _postagensFiltradas.push(_post);
            }
        }
        return _postagensFiltradas;
    }
    // Made by Patro
    obterQuantidadeDePerfis() {
        return this._repPerfis.obterQuantidadeDePerfis();
    }
    obterQuantidadeDePostagens() {
        return this._repPostagens.obterQuantidadeDePostagens();
    }
    listarPerfis() {
        return this._repPerfis.listarPerfis();
    }
}
const readline_sync_1 = require("readline-sync");
class App {
    constructor() {
        this.menuOpcoes = [
            "Criar Perfil",
            "Criar Postagem",
            "Listar Perfis",
            "Ver Feed"
        ];
        this._redeSocial = new RedeSocial;
    }
    /*
        Gerenciar Perfis:
        - Criar perfil,
        - Listar perfis,
        - Consultar perfil,
        - Excluir perfil,
        - Editar perfil

        Gerenciar postagens:
        - Criar postagem (simples e avançada) --- lembrar de usar data atual do sistema
        - Listar postagens,
        - Consultar postagem,
        - Excluir postagem,
        - Editar postagem,
        - Curtir postagem,
        - Descurtir postagem
        - Postagem Avançada: Adicionar hashtag, exibir postagens por hashtag
        - Postagem Avançada: Visualizações restantes
        
        Ver Feed:
        - Exibir postagens por perfil,
        - Exibir postagens por hashtag
        
        # Funções do Menu:
        - Exibir opções
        - Obter opção
        - Executar Opção

        # Extras X1:
        - Leitura e gravação de arquivos (ao iniciar e encerrar o programa)

        # Extras X2:
        - Exibir postagens populares
        - Exibir hashtags populares (as que estão presentes em mais postagens)

        # Extras X3:
        - Exibir postagens classificando por data, curtidas, descurtidas, visualizações
        - Excluir postagens por perfil, hashtag ou data
        - Favoritar postagem (auto-explicativo)
        - Exibir postagens favoritas
        - Arquivar postagem (impedir de ser exibida normalmente, mas permitir que seja exibida por meio de uma opção no menu)
        - Exibir postagens arquivadas
        
        # Extras X4:
        - Tela de início animada
        - Tela de encerramento animada
        - Menu interativo (com setas e teclas de atalho)
        - Ver feed por data de postagem


    */
    exibirTexto(texto) {
        console.log(texto);
    }
    obterNumeroInteiro(mensagem) {
        let numero = Number((0, readline_sync_1.question)(mensagem));
        while (isNaN(numero)) {
            this.exibirTexto("Número inválido. Tente novamente.");
            numero = Number((0, readline_sync_1.question)(mensagem));
        }
        return numero;
    }
    obterOpcao() {
        let opcao = Number((0, readline_sync_1.question)("Opção: "));
        while (opcao < 0 || opcao > this.menuOpcoes.length) {
            this.exibirTexto("Opção inválida. Tente novamente.");
            opcao = Number((0, readline_sync_1.question)("Opção: "));
        }
        return opcao;
    }
    exibirOpcoes() {
        this.exibirTexto("--- MENU ---");
        for (let i = 0; i < this.menuOpcoes.length; i++) {
            this.exibirTexto(`${i + 1} - ${this.menuOpcoes[i]}`);
        }
    }
    executarOpcao(opcao) {
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
    criarPerfil() {
        this.exibirTexto("# Criar Perfil");
        let id = this._redeSocial.obterQuantidadeDePerfis() + 1;
        let nome = (0, readline_sync_1.question)("Nome: ");
        let email = (0, readline_sync_1.question)("Email: ");
        let perfil = new Perfil(id, nome, email);
        this._redeSocial.incluirPerfil(perfil);
    }
    criarPostagem() {
        this.exibirTexto("# Criar Postagem");
        let id = this._redeSocial.obterQuantidadeDePostagens() + 1;
        let curtidas = 0;
        let descurtidas = 0;
        let data = new Date; // Obter data atual do sistema
        // Tentar obter perfil:
        let idPerfil = -1;
        let perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
        let tentativasDeEncontrarPerfil = 0;
        while (idPerfil < 0) {
            idPerfil = this.obterNumeroInteiro("ID do perfil: ");
            // Aqui seria interessante listar os perfis, e mostrar a opção 0 - Cancelar.
            perfil = this._redeSocial.consultarPerfil(idPerfil, undefined, undefined);
            if (perfil === null) {
                this.exibirTexto("Perfil não encontrado.");
                idPerfil = -1; // Voltando a -1, faz permanecer no ciclo.
                tentativasDeEncontrarPerfil++;
            }
            // Porém, se esgotar 3 tentativas, é melhor abortar a criação de postagem.
            if (tentativasDeEncontrarPerfil > 3) {
                this.exibirTexto("Tente novamente mais tarde.");
                return;
            }
        }
        // Perfil encontrado, continuar a criação da postagem:
        let texto = (0, readline_sync_1.question)("Texto: ");
        // Condição impossível, mas necessária para evitar erros.
        if (perfil != null) {
            var _postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            this._redeSocial.incluirPostagem(_postagem);
            this.exibirTexto(`Postagem No ${id} criada com sucesso.`);
        }
    }
    listarPerfis() {
        this._redeSocial.listarPerfis();
    }
    verFeed() {
        this.exibirTexto("Feed da Rede Social");
        let postagens = this._redeSocial.consultarPostagens(undefined, undefined, undefined, undefined);
        postagens.forEach((post) => {
            this.exibirTexto(`Postagem ${post.id}, por ${post.perfil.nome}: ${post.texto}`);
            console.log();
        });
    }
    executar() {
        this.exibirOpcoes();
        let opcao = this.obterOpcao();
        while (opcao != 0) {
            this.executarOpcao(opcao);
            opcao = this.obterOpcao();
        }
        console.log("Fim do Programa.");
    }
}
function main() {
    const app = new App();
    app.executar();
}
main();
