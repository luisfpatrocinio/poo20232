export class Account {
    private _id: string;
    private _name: string
    private _balance: number;
  
    constructor(id: string, name: string, balance: number = 0) {
        this._id = id;
        this._name = name;
        this._balance = balance;
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
  
    get saldo(): number {
        return this._balance;
    }

    set saldo(_value: number) {
        this._balance = _value;
    }

    get numero(): string {
        return this._numero;
    }
  
    transfer(destinyAccount: Conta, value: number): boolean {
        if (!this.sacar(value)) {
            return false;
        }
  
        destinyAccount.depositar(value);
        return true;
    }
  
    toString () {
      return `
      Numero da conta: ${this._id}
      Nome do titular: ${this._name}
      Saldo em conta: ${this._balance}
      `
    }
}

export class Poupanca extends Conta {
    private _taxaDeJuros: number;

    constructor(numero: string, nome: string, taxaDeJuros: number) {
        super(numero, nome);
        this._taxaDeJuros = taxaDeJuros;
    }
}