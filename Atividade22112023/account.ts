import { InsufficientFundsError, NegativeValueError } from "./Exceptions/exceptions";

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
  
    validateValue(value: number): void {
        if (value <= 0) {
            throw new NegativeValueError();
        }
    }

    deposit(value: number): void {
        this._balance = this._balance + value;
    }
  
    withdraw(amount: number): void {
        this.validateValue(amount);
        if (amount > this._balance) {
            throw new InsufficientFundsError();
        }
        this._balance -= amount;
    }
  
    transfer(destinyAccount: Account, value: number): void {
        this.withdraw(value);
        destinyAccount.deposit(value);
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