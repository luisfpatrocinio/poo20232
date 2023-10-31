"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDePerfis = void 0;
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
exports.RepositorioDePerfis = RepositorioDePerfis;
