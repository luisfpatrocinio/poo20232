public class Ex07{
    public static void main(String[] args) {
        Retangulo r = new Retangulo();

        // Obter do usuário o tamanho da base:
        r.base = 10;
        r.altura = 20;
        System.out.println("Área: " + r.calcularArea() + "m²");
        System.out.println("Perímetro: " + r.calcularPerimetro() + "m");
    }
}

class Retangulo {
    double base;
    double altura;
    
    double calcularArea(){
        return base * altura;
    }

    double calcularPerimetro() {
        return 2 * (base + altura);
    }
}