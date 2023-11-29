"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saving = exports.Account = void 0;
const exceptions_1 = require("./Exceptions/exceptions");
class Account {
    constructor(id, name, balance = 0) {
        this._id = id;
        this._name = name;
        this._balance = balance;
    }
    get balance() {
        return this._balance;
    }
    set balance(_value) {
        this._balance = _value;
    }
    get id() {
        return this._id;
    }
    validateValue(value) {
        if (value <= 0) {
            throw new exceptions_1.NegativeValueError();
        }
    }
    deposit(value) {
        this._balance = this._balance + value;
    }
    withdraw(amount) {
        this.validateValue(amount);
        if (amount > this._balance) {
            throw new exceptions_1.InsufficientFundsError();
        }
        this._balance -= amount;
    }
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
}
exports.Saving = Saving;
