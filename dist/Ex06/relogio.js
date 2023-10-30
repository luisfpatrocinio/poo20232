"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Hora {
    constructor(hora = 0, minutos = 0, segundos = 0) {
        this.hora = hora;
        this.minutos = minutos;
        this.segundos = segundos;
    }
    obterHora() {
        return this.hora;
    }
    obterMinuto() {
        return this.minutos;
    }
    obterSegundo() {
        return this.segundos;
    }
    ajeitarNumero(numero) {
        return numero.toString().padStart(2, '0');
    }
    obterHoraCompleta() {
        return `${this.ajeitarNumero(this.obterHora())}:${this.ajeitarNumero(this.obterMinuto())}:${this.ajeitarNumero(this.obterSegundo())}`;
    }
}
function main() {
    (0, utils_1.showCenterText)("PatroClock");
    console.log("Obtendo a hora do PC:");
    const date = new Date();
    let hora = new Hora(date.getHours(), date.getMinutes(), date.getSeconds());
    console.log(hora.obterHoraCompleta());
}
main();
