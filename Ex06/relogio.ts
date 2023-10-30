import { showCenterText } from "../utils";

class Hora {
    private hora: number;
    private minutos: number;
    private segundos: number;

    constructor(hora: number = 0, minutos: number = 0, segundos: number = 0) {
        this.hora = hora;
        this.minutos = minutos;
        this.segundos = segundos;
    }

    public obterHora(): number {
        return this.hora;
    }

    public obterMinuto(): number {
        return this.minutos;
    }

    public obterSegundo(): number {
        return this.segundos;
    }

    public ajeitarNumero(numero: number): string {
        return numero.toString().padStart(2, '0');
    }

    public obterHoraCompleta(): string {
        return `${this.ajeitarNumero(this.obterHora())}:${this.ajeitarNumero(this.obterMinuto())}:${this.ajeitarNumero(this.obterSegundo())}`;
    }
}

function main() {
    showCenterText("PatroClock");
    console.log("Obtendo a hora do PC:")
    const date = new Date();
    let hora = new Hora(date.getHours(), date.getMinutes(), date.getSeconds());
    console.log(hora.obterHoraCompleta());
}

main();