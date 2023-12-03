import { Tributavel } from "./tributavel";

export abstract class Conta {
    private _nome: string;
    private _saldo: number;

    public getNome(): string {
        return this._nome;
    }

    public setNome(nome: string): void {
        this._nome = nome;
    }

    public getSaldo(): number {
        return this._saldo;
    }

    public setSaldo(saldo: number): void {
        this._saldo = saldo;
    }

    constructor(nome: string, saldo: number) {
        this._nome = nome;
        this._saldo = saldo;
    }
}

export class ContaCorrente extends Conta implements Tributavel {
    constructor(nome: string, saldo: number) {
        super(nome, saldo);
    }

    calculaTributos(): number {
        return this.getSaldo() * 0.10;
    }
}

