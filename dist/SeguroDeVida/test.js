"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auditoriaInterna_1 = require("./auditoriaInterna");
const conta_1 = require("./conta");
const seguroDeVida_1 = require("./seguroDeVida");
class Test {
    constructor() {
        this._auditoria = new auditoriaInterna_1.AuditoriaInterna;
    }
    run() {
        console.log("Iniciando testes.........");
        let c1 = new conta_1.ContaCorrente("João", 500);
        let c2 = new conta_1.ContaCorrente("Pedro", 200);
        // let c3 = new ContaCorrente("Maria", 3000);
        let s1 = new seguroDeVida_1.SeguroDeVida();
        let s2 = new seguroDeVida_1.SeguroDeVida();
        this._auditoria.adicionar(c1);
        this._auditoria.adicionar(c2);
        // this._auditoria.adicionar(c3);
        this._auditoria.adicionar(s1);
        this._auditoria.adicionar(s2);
        console.log("Resultado dos tributos: ", this._auditoria.calcularTributo());
    }
}
function main() {
    let test = new Test();
    test.run();
}
main();
