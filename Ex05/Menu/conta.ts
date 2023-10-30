export class Conta {
    private _numero: string;
    private _nome: string
    private _saldo: number;
  
    constructor(numero: string, nome: string, saldo: number = 0) {
        this._numero = numero;
        this._nome = nome;
        this._saldo = saldo;
    }
  
    depositar(valor: number): void {
        this.saldo = this.saldo + valor;
    }
  
    sacar(valor: number): boolean {
        if (this.saldo - valor < 0) {
            return false;
        }
  
        this.saldo = this.saldo - valor;
        return true;
    }
  
    get saldo(): number {
        return this._saldo;
    }

    set saldo(_value: number) {
        this._saldo = _value;
    }

    get numero(): string {
        return this._numero;
    }
  
    transferir(contaDestino: Conta, valor: number): boolean {
        if (!this.sacar(valor)) {
            return false;
        }
  
        contaDestino.depositar(valor);
        return true;
    }
  
    toString () {
      return `
      Numero da conta: ${this._numero}
      Nome do titular: ${this._nome}
      Saldo em conta: ${this.saldo}
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