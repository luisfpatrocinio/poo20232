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
            ["Excluir Conta", this.deleteAccount, () => true],
            // ["Sacar", this.withdraw, () => true],
            // ["Depositar", this.deposit, () => true],
            ["Transferir", this.transfer, () => { return this._bank.accounts.length > 1; }],
            // ["Sair", this.exit, () => true]
        ];
        this.selectedOption = -1;
    }
    getNextAccountID() {
        let id = 1;
        if (this._bank.accounts.length > 0) {
            id = this._bank.accounts[this._bank.accounts.length - 1].id + 1;
        }
        return id;
    }
    /**
     * Obtém uma conta a partir de seu ID.
     * @returns A conta com o ID especificado.
     * @throws {UserCancelError} Se o usuário cancelar a ação.
     * @throws {AccountNotFoundError} Se a conta não for encontrada.
     */
    getAccountById() {
        // Exibe um resumo das contas.
        this.showAccountsShort();
        console.log(`0 - Cancelar`);
        // Obtém o ID da conta
        let id = (0, ioUtils_1.getNumber)("Digite o ID da conta: ");
        if (id == 0) {
            // Retorna para o menu anterior.
            this.previousView();
            // Lançar erro.
            throw new exceptions_1.UserCancelError("Ação cancelada pelo usuário.");
        }
        let account;
        try {
            // Verifica se a conta existe, e a retorna.
            account = this._bank.consult(id);
            return account;
        }
        catch (error) {
            if (error instanceof exceptions_1.AccountNotFoundError) {
                // Retorna para o menu anterior.
                this.previousView();
            }
        }
        // Se chegou até aqui, é porque a conta não foi encontrada.
        throw new exceptions_1.AccountNotFoundError("Conta não encontrada.");
    }
    // Métodos de Menus
    previousView() {
        this._viewStack.pop();
    }
    /**
     * Exibe a listagem de contas de maneira resumida.
     */
    showAccountsShort() {
        this._bank.accounts.forEach((a) => {
            console.log(`Conta ${a.id}: ${a.name} - Saldo: ${a.balance}`);
        });
    }
    // Métodos do Banco
    registerAccount() {
        (0, menuUtils_1.showHeader)("Registrar Conta");
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
        this.previousView();
        return;
    }
    consultAccount() {
        (0, menuUtils_1.showHeader)("Consultar Conta");
        let account = this.getAccountById();
        // Exibir informações da conta.
        console.log(account.toString());
        // Retornar
        this.previousView();
    }
    deleteAccount() {
        (0, menuUtils_1.showHeader)("Excluir Conta");
        let account = this.getAccountById();
        this._bank.deleteAccount(account.id);
        // Retornar
        this.previousView();
    }
    transfer() {
        let transferAccounts = [];
        while (transferAccounts.length < 2) {
            (0, menuUtils_1.showHeader)("Transferir Valores");
            if (transferAccounts.length > 0) {
                console.log(`Transferindo de ${transferAccounts[0].name} para:`);
            }
            let _acc = this.getAccountById();
            if (transferAccounts.includes(_acc)) {
                this.previousView();
                throw new exceptions_1.TransferToYourselfError("Impossível transferir para si mesmo.");
            }
            transferAccounts.push(_acc);
        }
        (0, menuUtils_1.showHeader)(`Transferindo de ${transferAccounts[0].name} para ${transferAccounts[1].name}.`);
        console.log("Quanto deseja transferir?");
        let _value = (0, ioUtils_1.getNumber)("Valor: ");
        try {
            this._bank.transfer(transferAccounts[0].id, transferAccounts[1].id, _value);
        }
        catch (_e) {
            if (_e instanceof exceptions_1.InsufficientFundsError) {
                throw new exceptions_1.InsufficientFundsError(`A conta de ${transferAccounts[0].name} não possui saldo suficiente.`);
            }
        }
        console.log(`R$${_value.toFixed(2)} transferido da conta ${transferAccounts[0].name} para ${transferAccounts[1].name} com sucesso.`);
        this.previousView();
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
                (0, menuUtils_1.showError)(_e);
            }
            // Essa checagem garante que o EnterToContinue só aconteça a partir de telas que não envolvam seleção de opções do usuário.
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
