"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
const bank_1 = require("./bank");
const ioUtils_1 = require("./Utils/ioUtils");
const visualUtils_1 = require("./Utils/visualUtils");
const menuUtils_1 = require("./Utils/menuUtils");
const exceptions_1 = require("./Exceptions/exceptions");
class App {
    constructor() {
        // Banco:
        this._bank = new bank_1.Bank();
        // Pilha de Telas:
        this._viewStack = new menuUtils_1.Stack();
        // Atributos: Nome, Opção, Condição
        this.menuOptions = [
            ["Cadastrar Conta", this.registerAccount, () => true],
            ["Consultar Conta", this.consultAccount, () => true],
            // ["Excluir Conta", this.deleteAccount, () => true],
            // ["Sacar", this.withdraw, () => true],
            // ["Depositar", this.deposit, () => true],
            // ["Transferir", this.transfer, () => true],
            // ["Sair", this.exit, () => true]
        ];
        this.selectedOption = -1;
    }
    getNextAccountID() {
        return 1;
        let id = 1;
        if (this._bank.accounts.length > 0) {
            id = this._bank.accounts[this._bank.accounts.length - 1].id + 1;
        }
        return id;
    }
    // Métodos
    registerAccount() {
        // Cabeçalho
        (0, visualUtils_1.clearTerminal)();
        console.log("Cadastrar Conta");
        // Obter dados da conta
        let id = this.getNextAccountID();
        let name = (0, ioUtils_1.getText)("Digite o nome do cliente: ");
        let balance = parseFloat((0, ioUtils_1.getText)("Digite o saldo inicial da conta: "));
        // Instanciar nova conta
        let newAccount = new account_1.Account(id, name, balance);
        // Inserir conta no banco
        this._bank.insertAccount(newAccount);
        // Exibir mensagem de sucesso
        console.log("Conta cadastrada com sucesso!");
        console.log(newAccount.toString());
        this._viewStack.pop();
        return;
    }
    consultAccount() {
        (0, visualUtils_1.clearTerminal)();
        console.log("Consultar Conta");
        let id = parseInt((0, ioUtils_1.getText)("Digite o ID da conta: "));
        try {
            let account = this._bank.consult(id);
            console.log(account.toString());
        }
        catch (error) {
            if (error instanceof exceptions_1.AccountNotFoundError) {
                console.log("Conta não encontrada.");
            }
        }
        this._viewStack.pop();
    }
    getOptionsToShow() {
        let optionsToShow = [];
        for (let i = 0; i < this.menuOptions.length; i++) {
            if (this.menuOptions[i][2]()) {
                optionsToShow.push(this.menuOptions[i]);
            }
        }
        return optionsToShow;
    }
    showMenu() {
        console.log("Banco");
        // Mostrar opções conforme getOptionsToShow
        let optionsToShow = this.getOptionsToShow();
        for (let i = 0; i < optionsToShow.length; i++) {
            console.log(`${i + 1} - ${optionsToShow[i][0]}`);
        }
        console.log("0 - Sair");
        // Obter opção selecionada
        this.selectedOption = parseInt((0, ioUtils_1.getText)("Digite a opção desejada: "));
        // Executar opção selecionada
        if (this.selectedOption == 0) {
            this._viewStack.pop();
            return;
        }
        let funcao = optionsToShow[this.selectedOption - 1][1];
        this._viewStack.push(funcao);
        // funcao.call(this);
    }
    exit() {
        console.log("Saindo...");
    }
    run() {
        this._viewStack.push(this.showMenu);
        do {
            this.selectedOption = -1;
            try {
                (0, visualUtils_1.clearTerminal)();
                let actualView = this._viewStack.peek();
                if (actualView != undefined) {
                    actualView.call(this);
                }
            }
            catch (_e) {
                console.log("Erro inesperado!");
                console.log(_e.message);
            }
            if (this.selectedOption == -1) {
                (0, ioUtils_1.enterToContinue)();
            }
        } while (!this._viewStack.isEmpty());
        this.exit();
    }
}
function main() {
    let app = new App();
    app.run();
}
main();
