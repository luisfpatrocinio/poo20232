"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaInterna = void 0;
class AuditoriaInterna {
    constructor() {
        this._tributaveis = new Array;
    }
    adicionar(tributavel) {
        this._tributaveis.push(tributavel);
    }
    calcularTributo() {
        const total = this._tributaveis.reduce((acc, tributavel) => {
            return acc + tributavel.calculaTributos();
        }, 0);
        return total;
    }
}
exports.AuditoriaInterna = AuditoriaInterna;
