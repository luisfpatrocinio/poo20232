"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saving = exports.Account = void 0;
const exceptions_1 = require("./Exceptions/exceptions");
/**
 * Classe que representa uma conta bancária.
 */
class Account {
    /**
     * @param id Identificador da Conta
     * @param name Nome do titular da Conta
     * @param balance Saldo inicial (valor padrão: 0)
     */
    constructor(id, name, balance = 0) {
        this._id = id;
        this._name = name;
        this._balance = balance;
    }
    /**
     * Retorna o saldo atual da conta.
     * @returns saldo atual
     */
    get balance() {
        return this._balance;
    }
    /** Define o novo valor de saldo da conta
     * @param value Valor desejado
     */
    set balance(value) {
        this._balance = value;
    }
    /**
     * Retorna o nome do titular da conta.
     * @returns nome do titular da conta.
     */
    get name() {
        return this._name;
    }
    /**
     * Retorna o identificador único da conta.
     * @returns ID da conta
     */
    get id() {
        return this._id;
    }
    /**
     * Valida o valor fornecido.
     * @param value - O valor a ser validado.
     * @throws {NegativeValueError} - Se o valor for menor ou igual a 0.
     */
    validateValue(value) {
        if (value <= 0) {
            throw new exceptions_1.NegativeValueError();
        }
    }
    /**
     * Adiciona um valor ao saldo da conta.
     * @param value Valor a ser adicionado
     */
    deposit(value) {
        this._balance = this._balance + value;
    }
    /**
     * Retira o valor especificado do saldo da conta.
     * @param amount - O valor a ser retirado da conta.
     * @throws {NegativeValueError} - Se o valor for menor ou igual a 0.
     * @throws {InsufficientFundsError} - Se o valor for maior que o saldo atual.
     */
    withdraw(amount) {
        this.validateValue(amount);
        if (amount > this._balance) {
            throw new exceptions_1.InsufficientFundsError();
        }
        this._balance -= amount;
    }
    /**
        * Transfere um valor especificado da conta atual para a conta de destino.
        * @param {Account} destinyAccount - A conta de destino para transferir o valor.
        * @param {number} value - O valor a ser transferido.
    */
    transfer(destinyAccount, value) {
        this.withdraw(value);
        destinyAccount.deposit(value);
    }
    toString() {
        return `
      ID da Conta: ${this._id}
      Nome do titular: ${this._name}
      Saldo em conta: ${this._balance}
      `;
    }
}
exports.Account = Account;
class Saving extends Account {
    constructor(id, name, balance, interestRate) {
        super(id, name, balance);
        this._interestRate = interestRate;
    }
    toString() {
        return `
        ID da Conta: ${this._id}
        Nome do titular: ${this._name}
        Saldo em conta: ${this._balance}
        Taxa de juros: ${this._interestRate}
        `;
    }
}
exports.Saving = Saving;
