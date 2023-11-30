import {Account, Saving} from './account';
import {Bank} from './bank';
import {getText, enterToContinue} from './Utils/ioUtils';
import {clearTerminal} from './Utils/visualUtils';
import { Stack } from './Utils/menuUtils';
import { AccountNotFoundError } from './Exceptions/exceptions';

class App {
    // Banco:
    private _bank: Bank = new Bank();

    // Pilha de Telas:
    private _viewStack: Stack<() => void> = new Stack<() => void>();

    // Atributos: Nome, Opção, Condição
    private menuOptions: Array<[string, () => void, () => boolean]> = [
        ["Cadastrar Conta", this.registerAccount, () => true],
        ["Consultar Conta", this.consultAccount, () => true],
        // ["Excluir Conta", this.deleteAccount, () => true],
        // ["Sacar", this.withdraw, () => true],
        // ["Depositar", this.deposit, () => true],
        // ["Transferir", this.transfer, () => true],
        // ["Sair", this.exit, () => true]
    ]
    
    private selectedOption: number = -1;

    public getNextAccountID(): number {
        return 1;
        let id: number = 1;
        if (this._bank.accounts.length > 0) {
            id = this._bank.accounts[this._bank.accounts.length - 1].id + 1;
        }
        return id;
    }
    
    // Métodos
    public registerAccount(): void {
        // Cabeçalho
        clearTerminal();
        console.log("Cadastrar Conta");

        // Obter dados da conta
        let id: number = this.getNextAccountID();
        let name: string = getText("Digite o nome do cliente: ");
        let balance: number = parseFloat(getText("Digite o saldo inicial da conta: "));

        // Instanciar nova conta
        let newAccount: Account = new Account(id, name, balance);

        // Inserir conta no banco
        this._bank.insertAccount(newAccount);

        // Exibir mensagem de sucesso
        console.log("Conta cadastrada com sucesso!");
        console.log(newAccount.toString());

        this._viewStack.pop();
        return;
    }

    public consultAccount(): void {
        clearTerminal();
        console.log("Consultar Conta");
        let id: number = parseInt(getText("Digite o ID da conta: "));
        try {
            let account: Account = this._bank.consult(id);
            console.log(account.toString());
        } catch (error: any) {
            if (error instanceof AccountNotFoundError) {
                console.log("Conta não encontrada.");
            }
        }
        this._viewStack.pop();
    }

    public getOptionsToShow(): Array<[string, () => void, () => boolean]> {
        let optionsToShow: Array<[string, () => void, () => boolean]> = [];

        for (let i: number = 0; i < this.menuOptions.length; i++) {
            if (this.menuOptions[i][2]()) {
                optionsToShow.push(this.menuOptions[i]);
            }
        }

        return optionsToShow;
    }

    public showMenu(): void {
        console.log("Banco");
        // Mostrar opções conforme getOptionsToShow
        let optionsToShow: Array<[string, () => void, () => boolean]> = this.getOptionsToShow();
        for (let i: number = 0; i < optionsToShow.length; i++) {
            console.log(`${i+1} - ${optionsToShow[i][0]}`);
        }
        console.log("0 - Sair");
        // Obter opção selecionada
        this.selectedOption = parseInt(getText("Digite a opção desejada: "));
        // Executar opção selecionada
        if (this.selectedOption == 0) {
            this._viewStack.pop();
            return;
        }
        let funcao = optionsToShow[this.selectedOption-1][1];
        this._viewStack.push(funcao);
        // funcao.call(this);
    }

    public exit(): void {
        console.log("Saindo...");
    }

    public run(): void {
        this._viewStack.push(this.showMenu);
        do {
            this.selectedOption = -1;
            try {
                clearTerminal();
                let actualView = this._viewStack.peek();
                if (actualView != undefined) {
                    actualView.call(this);
                }
            } catch (_e: any) {
                console.log("Erro inesperado!");
                console.log(_e.message);
            }
            if (this.selectedOption == -1) {
                enterToContinue();
            }
        } while (!this._viewStack.isEmpty());
        this.exit();
    }   
}

function main() {
    let app: App = new App();
    app.run();
}

main();