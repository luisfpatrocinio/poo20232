public class Ex09 {
    public static void main(String[] args) {
        SituacaoFinanceira situacao = new SituacaoFinanceira();
        situacao.valorCreditos = 1000;
        situacao.valorDebitos = 500;
        System.out.println("Saldo: " + situacao.saldo());
    }    
}

class SituacaoFinanceira {      
    double valorCreditos;
    double valorDebitos;

    public double saldo() {
        return valorCreditos - valorDebitos;
    }


}