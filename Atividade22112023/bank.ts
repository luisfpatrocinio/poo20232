import { AccountNotFoundError } from './Exceptions/exceptions.js';
import {Account, Saving} from './account.js';

export class Bank {
    private _accounts: Account[] = []

    get accounts(): Account[] {
        return this._accounts;
    }

    public insertAccount(account: Account): void {      
        this._accounts.push(account);
    }

    /**
     * Retorna a conta com o ID especificado.
     * @param id - O ID da conta desejada.
     * @returns A conta com o ID especificado.
     * @throws {AccountNotFoundError} Se a conta com o ID especificado não for encontrada.
     */
    public consult(id: number): Account {
        let desiredAccount: Account | null = null;
        for (let i: number = 0; i < this._accounts.length; i++) {
            if (this._accounts[i].id == id) {
                desiredAccount = this._accounts[i];
                break;  
            }
        }
        
        if (desiredAccount == null) {
            throw new AccountNotFoundError(`A conta ${id} não foi encontrada.`);
        }

        return desiredAccount;
    }

    /**
     * Retorna o ID da conta
     * @param id 
     * @returns 
     */
    public consultById(id: number): number {
        let desiredId: number = -1;

        for (let i: number = 0; i < this._accounts.length; i++) {
            if (this._accounts[i].id == id) {
                desiredId = i;
                break;
            }
        }

        return desiredId;
    }

    public deleteAccount(id: number): void {
        let desiredId = this.consultById(id);

        if (desiredId != -1) {
            for (let i = desiredId; i < this._accounts.length; i++) {
                this._accounts[i] = this._accounts[i+1];
            }
            this._accounts.pop();
        }
    }

    public withdraw(id: number, value: number): void {
        let desiredAccount: number = this.consultById(id);

        if (desiredAccount != -1) { //Achou uma Account
            let acc: Account = this._accounts[desiredAccount];    
            acc.withdraw(value);
        }
    }

    public transfer (accFromID: number, accToID: number, valor: number): void{
      let originIndex: number = this.consultById(accFromID)
      let destinyIndex: number = this.consultById(accToID)

      if (destinyIndex != -1 && originIndex != -1){
        let contaDestino: Account = this._accounts[destinyIndex] 
        let contaOrigem: Account = this._accounts[originIndex]

        contaOrigem.transfer(contaDestino, valor)
      }
    }

    public qntAccounts (): number{
      let qtd = this._accounts.length
      return qtd;
    }

    public bankBalance (): number{
      let total: number = 0;

      for (let acc of this._accounts){
        total += acc.balance;
      }

      return total;
    }

    public averageBalance(): number {
      return this.bankBalance() / this.qntAccounts()
    }
}

function main() {
    // let patroBank = new Bank();
    // patroBank.insertAccount(new Account(1, "João", 1000));
    // patroBank.insertAccount(new Account(1, "Maria", 1000));
    
    var c1 = new Account(1, "João", 1000);
    var c2 = new Account(2, "Maria", 1000);
    try {
        c1.transfer(c2, 200);
        c1.transfer(c2, 2000);
    } catch (error: any) {
        console.log(error.message);
    }
        
    console.log(c1.toString());
}

main();