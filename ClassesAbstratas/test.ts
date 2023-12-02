abstract class FiguraGeometrica {
    abstract calcularArea(): number
    abstract calcularPerimetro(): number
}

class Triangulo extends FiguraGeometrica {
    constructor(public base: number, public altura: number) {
        super();
    }

    calcularArea(): number {
        return this.base * this.altura / 2;
    }

    calcularPerimetro(): number {
        return this.base + this.altura;
    }
}

class Quadrado extends FiguraGeometrica {
    calcularArea(): number {
        throw new Error("Method not implemented.");
    }
    calcularPerimetro(): number {
        throw new Error("Method not implemented.");
    }

}