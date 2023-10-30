"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conta = void 0;
class Conta {
    constructor(numero, nome, saldo = 0) {
        this.numero = numero;
        this.nome = nome;
        this.saldo = saldo;
    }
    depositar(valor) {
        this.saldo = this.saldo + valor;
    }
    sacar(valor) {
        if (this.saldo - valor < 0) {
            return false;
        }
        this.saldo = this.saldo - valor;
        return true;
    }
    consultarSaldo() {
        return this.saldo;
    }
    transferir(contaDestino, valor) {
        if (!this.sacar(valor)) {
            return false;
        }
        contaDestino.depositar(valor);
        return true;
    }
    toString() {
        return `
      Numero da conta: ${this.numero}
      Nome do titular: ${this.nome}
      Saldo em conta: ${this.saldo}
      `;
    }
}
exports.Conta = Conta;
