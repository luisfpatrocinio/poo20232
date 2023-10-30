"use strict";
class Veiculo {
    constructor(placa, ano) {
        this.placa = placa;
        this.ano = ano;
    }
}
class Carro extends Veiculo {
    constructor(placa, ano, modelo) {
        super(placa, ano);
        this.modelo = modelo;
    }
}
class CarroEletrico extends Carro {
    constructor(placa, ano, modelo, autonomiaBateria) {
        super(placa, ano, modelo);
        this.autonomiaBateria = autonomiaBateria;
    }
}
let c1 = new CarroEletrico("ABC1234", 2020, "Tesla", 1000);
console.log(c1);
