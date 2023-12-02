"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = void 0;
const exceptions_js_1 = require("./Exceptions/exceptions.js");
const account_js_1 = require("./account.js");
class Bank {
    constructor() {
        this._accounts = [];
    }
    get accounts() {
        return this._accounts;
    }
    insertAccount(account) {
        this._accounts.push(account);
    }
    /**
     * Retorna a conta com o ID especificado.
     * @param id - O ID da conta desejada.
     * @returns A conta com o ID especificado.
     * @throws {AccountNotFoundError} Se a conta com o ID especificado não for encontrada.
     */
    consult(id) {
        let desiredAccount = null;
        for (let i = 0; i < this._accounts.length; i++) {
            if (this._accounts[i].id == id) {
                desiredAccount = this._accounts[i];
                break;
            }
        }
        if (desiredAccount == null) {
            throw new exceptions_js_1.AccountNotFoundError(`A conta ${id} não foi encontrada.`);
        }
        return desiredAccount;
    }
    /**
     * Retorna o ID da conta
     * @param id
     * @returns
     */
    consultById(id) {
        let desiredId = -1;
        for (let i = 0; i < this._accounts.length; i++) {
            if (this._accounts[i].id == id) {
                desiredId = i;
                break;
            }
        }
        return desiredId;
    }
    deleteAccount(id) {
        let desiredId = this.consultById(id);
        if (desiredId != -1) {
            for (let i = desiredId; i < this._accounts.length; i++) {
                this._accounts[i] = this._accounts[i + 1];
            }
            this._accounts.pop();
        }
    }
    withdraw(id, value) {
        let desiredAccount = this.consultById(id);
        if (desiredAccount != -1) { //Achou uma Account
            let acc = this._accounts[desiredAccount];
            acc.withdraw(value);
        }
    }
    transfer(accFromID, accToID, valor) {
        let originIndex = this.consultById(accFromID);
        let destinyIndex = this.consultById(accToID);
        if (destinyIndex != -1 && originIndex != -1) {
            let contaDestino = this._accounts[destinyIndex];
            let contaOrigem = this._accounts[originIndex];
            contaOrigem.transfer(contaDestino, valor);
        }
    }
    qntAccounts() {
        let qtd = this._accounts.length;
        return qtd;
    }
    bankBalance() {
        let total = 0;
        for (let acc of this._accounts) {
            total += acc.balance;
        }
        return total;
    }
    averageBalance() {
        return this.bankBalance() / this.qntAccounts();
    }
}
exports.Bank = Bank;
function main() {
    // let patroBank = new Bank();
    // patroBank.insertAccount(new Account(1, "João", 1000));
    // patroBank.insertAccount(new Account(1, "Maria", 1000));
    var c1 = new account_js_1.Account(1, "João", 1000);
    var c2 = new account_js_1.Account(2, "Maria", 1000);
    try {
        c1.transfer(c2, 200);
        c1.transfer(c2, 2000);
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(c1.toString());
}
main();
