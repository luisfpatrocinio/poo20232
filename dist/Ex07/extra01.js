"use strict";
class Empregado {
    constructor() {
        this.salario = 500;
    }
    calcularSalario() {
        return this.salario;
    }
}
class Diarista extends Empregado {
    calcularSalario() {
        return this.salario / 30;
    }
}
class Horista extends Diarista {
    calcularSalario() {
        return this.salario / 24;
    }
}
class Pessoa {
    get nome() {
        return this._nome;
    }
    get nomeCompleto() {
        return this._nome + " " + this._sobreNome;
    }
    constructor(nome, sobreNome) {
        this._nome = nome;
        this._sobreNome = sobreNome;
    }
}
/*
class Funcionario extends Pessoa {
    _matricula: string;
    _salario: number;

    get matricula(): string {
        return this._matricula;
    }

    get salario(): number {
        return this._salario;
    }
}
*/ 
