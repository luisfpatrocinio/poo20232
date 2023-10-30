"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poupanca = exports.Conta = void 0;
class Conta {
    constructor(numero, nome, saldo = 0) {
        this._numero = numero;
        this._nome = nome;
        this._saldo = saldo;
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
    get saldo() {
        return this._saldo;
    }
    set saldo(_value) {
        this._saldo = _value;
    }
    get numero() {
        return this._numero;
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
      Numero da conta: ${this._numero}
      Nome do titular: ${this._nome}
      Saldo em conta: ${this.saldo}
      `;
    }
}
exports.Conta = Conta;
class Poupanca extends Conta {
    constructor(numero, nome, taxaDeJuros) {
        super(numero, nome);
        this._taxaDeJuros = taxaDeJuros;
    }
}
exports.Poupanca = Poupanca;
