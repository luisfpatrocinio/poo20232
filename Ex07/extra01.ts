class Empregado {
    salario: number = 500;
    calcularSalario(): number {
        return this.salario;
    }
}

class Diarista extends Empregado {
    calcularSalario(): number {
        return this.salario / 30;
    }
}

class Horista extends Diarista {
    calcularSalario(): number {
        return this.salario / 24;
    }
}

class Pessoa {
    _nome: string;
    _sobreNome: string;

    get nome(): string {
        return this._nome;
    }

    get nomeCompleto(): string {
        return this._nome + " " + this._sobreNome;
    }

    constructor(nome: string, sobreNome: string) {
        this._nome = nome;
        this._sobreNome = sobreNome;
    }
}

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