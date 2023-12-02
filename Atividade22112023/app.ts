import {Account, Saving} from './account';
import {Bank} from './bank';
import {getText, enterToContinue, getNumber} from './Utils/ioUtils';
import {clearTerminal} from './Utils/visualUtils';
import { Stack, showError, showHeader } from './Utils/menuUtils';
import { AccountNotFoundError, InsufficientFundsError, TransferToYourselfError, UserCancelError } from './Exceptions/exceptions';
import { showCenterText } from '../utils';

class App {
    // Banco:
    private _bank: Bank = new Bank();

    // Pilha de Telas:
    private _viewStack: Stack<() => void> = new Stack<() => void>();

    // Atributos: Nome, Opção, Condição
    private menuOptions: Array<[string, () => void, () => boolean]> = [
        ["Cadastrar Conta", this.registerAccount, () => true],
        ["Consultar Conta", this.consultAccount, () => true],
        ["Excluir Conta", this.deleteAccount, () => true],
        // ["Sacar", this.withdraw, () => true],
        // ["Depositar", this.deposit, () => true],
        ["Transferir", this.transfer, () => {return this._bank.accounts.length > 1}],
        // ["Sair", this.exit, () => true]
    ]
    
    private selectedOption: number = -1;

    public getNextAccountID(): number {
        let id: number = 1;
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
    public getAccountById(): Account {
        // Exibe um resumo das contas.
        this.showAccountsShort();
        console.log(`0 - Cancelar`);

        // Obtém o ID da conta
        let id: number = getNumber("Digite o ID da conta: ");

        if (id == 0) {
            // Retorna para o menu anterior.
            this.previousView();

            // Lançar erro.
            throw new UserCancelError("Ação cancelada pelo usuário.");
        }

        let account: Account;
        try {
            // Verifica se a conta existe, e a retorna.
            account = this._bank.consult(id);
            return account;
        } catch (error: any) {
            if (error instanceof AccountNotFoundError) {
                // Retorna para o menu anterior.
                this.previousView();
            }
        }

        // Se chegou até aqui, é porque a conta não foi encontrada.
        throw new AccountNotFoundError("Conta não encontrada.");
    }

    // Métodos de Menus
    public previousView(): void {
        this._viewStack.pop();
    }

    /**
     * Exibe a listagem de contas de maneira resumida.
     */
    public showAccountsShort(): void {
        this._bank.accounts.forEach((a) => {
            console.log(`Conta ${a.id}: ${a.name} - Saldo: ${a.balance}`)
        })
    }
    
    // Métodos do Banco
    public registerAccount(): void {
        showHeader("Registrar Conta");

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

        this.previousView();
        return;
    }

    public consultAccount(): void {
        showHeader("Consultar Conta");

        let account = this.getAccountById();

        // Exibir informações da conta.
        console.log(account.toString());

        // Retornar
        this.previousView();
    }

    public deleteAccount(): void {
        showHeader("Excluir Conta");

        let account = this.getAccountById();
        
        this._bank.deleteAccount(account.id);
        
        // Retornar
        this.previousView();
    }

    public transfer(): void {
        let transferAccounts: Array<Account> = [];
        while (transferAccounts.length < 2) {
            showHeader("Transferir Valores");
            if (transferAccounts.length > 0) {
                console.log(`Transferindo de ${transferAccounts[0].name} para:`);
            }
            let _acc = this.getAccountById();
            if (transferAccounts.includes(_acc)) {
                this.previousView();
                throw new TransferToYourselfError("Impossível transferir para si mesmo.");
            }
            transferAccounts.push(_acc);
        }

        showHeader(`Transferindo de ${transferAccounts[0].name} para ${transferAccounts[1].name}.`);
        console.log("Quanto deseja transferir?");
        let _value = getNumber("Valor: ");
        try {
            this._bank.transfer(
                transferAccounts[0].id, 
                transferAccounts[1].id,
                _value
                );
        } catch (_e) {
            if (_e instanceof InsufficientFundsError) {
                throw new InsufficientFundsError(`A conta de ${transferAccounts[0].name} não possui saldo suficiente.`);
            }
        }
        
        console.log(`R$${_value.toFixed(2)} transferido da conta ${transferAccounts[0].name} para ${transferAccounts[1].name} com sucesso.`)
        this.previousView();
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
                showError(_e);
            }

            // Essa checagem garante que o EnterToContinue só aconteça a partir de telas que não envolvam seleção de opções do usuário.
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