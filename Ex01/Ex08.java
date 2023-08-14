public class Ex08 {
    public static void main(String[] args) {
        Circle circulo = new Circle(20);
        System.out.println("Área: " + circulo.calcularArea() + "m²");
        System.out.println("Perímetro: " + circulo.calcularPerimetro() + "m");
    }    
}

class Circle {
    public double radius;

    Circle(double _radius) {
        radius = _radius;
    }

    double calcularArea() {
        return Math.PI * Math.pow(radius, 2);
    }

    double calcularPerimetro() {
        return 2 * Math.PI * radius;
    }
}