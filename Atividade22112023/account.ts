export class Account {
    private _id: number;
    private _name: string
    private _balance: number;
  
    constructor(id: number, name: string, balance: number = 0) {
        this._id = id;
        this._name = name;
        this._balance = balance;
    }

    get balance(): number {
        return this._balance;
    }

    set balance(_value: number) {
        this._balance = _value;
    }

    get id(): number {
        return this._id;
    }
  
    deposit(value: number): void {
        this._balance = this._balance + value;
    }
  
    withdraw(value: number): boolean {
        if (this._balance - value < 0) {
            return false;
        }
  
        this._balance = this._balance - value;
        return true;
    }
  
    transfer(destinyAccount: Account, value: number): boolean {
        if (!this.withdraw(value)) {
            return false;
        }
  
        destinyAccount.deposit(value);
        return true;
    }
  
    toString () {
      return `
      ID da Conta: ${this._id}
      Nome do titular: ${this._name}
      Saldo em conta: ${this._balance}
      `
    }
}

export class Saving extends Account {
    private _interestRate: number;

    constructor(id: number, name: string, balance: number, interestRate: number) {
        super(id, name, balance);
        this._interestRate = interestRate;
    }
}