"use strict";
class FiguraGeometrica {
}
class Triangulo extends FiguraGeometrica {
    constructor(base, altura) {
        super();
        this.base = base;
        this.altura = altura;
    }
    calcularArea() {
        return this.base * this.altura / 2;
    }
    calcularPerimetro() {
        return this.base + this.altura;
    }
}
class Quadrado extends FiguraGeometrica {
    calcularArea() {
        throw new Error("Method not implemented.");
    }
    calcularPerimetro() {
        throw new Error("Method not implemented.");
    }
}
