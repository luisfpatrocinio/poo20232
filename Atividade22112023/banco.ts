import {Conta, Poupanca} from './conta';

export class Banco {
    private contas: Conta[] = []

    public inserir(conta: Conta): void {      
      if ( this.consultar(conta.numero) == null){
        this.contas.push(conta);
      }
    }

    public consultar(numero: string): Conta | null {
        let contaProcurada: Conta | null = null;

        for (let i: number = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                contaProcurada = this.contas[i];
                break;
            }
        }

        return contaProcurada;
    }

    private consultarPorIndice(numero: string): number {
        let indiceProcurado: number = -1;

        for (let i: number = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                indiceProcurado = i;
                break;
            }
        }

        return indiceProcurado;
    }

    public alterar(conta: Conta): void {
        let indiceProcurado: number =
                this.consultarPorIndice(conta.numero);
        
        if (indiceProcurado != -1) {
            this.contas[indiceProcurado] = conta;
        }
    }

    public excluir(numero: string): void {
        let indiceProcurado = this.consultarPorIndice(numero);

        if (indiceProcurado != -1) {
            for (let i = indiceProcurado; i < this.contas.length; i++) {
                this.contas[i] = this.contas[i+1];
            }
            this.contas.pop();
            
        }
    }

    public sacar(numero: string, valor: number): void {
        let indiceProcurado: number = this.consultarPorIndice(numero);

        if (indiceProcurado != -1) { //Achou uma conta
            let conta: Conta = this.contas[indiceProcurado];    
            conta.sacar(valor);
        }
    }

    public transferir (numeroCredito: string, numeroDebito: string, valor: number): void{
      let indiceOrigem: number = this.consultarPorIndice(numeroDebito)
      let indiceDestino: number = this.consultarPorIndice(numeroCredito)

      if ( indiceDestino != -1 && indiceOrigem != -1){
        let contaDestino: Conta = this.contas[indiceDestino] 
        let contaOrigem: Conta = this.contas[indiceOrigem]

        contaOrigem.transferir(contaDestino, valor)
      }

    }

    public qtdContas (): number{
      let qtd = this.contas.length

      return qtd;
    }

    public saldoBanco (): number{
      let total: number = 0;

      for (let conta of this.contas){
        total += conta.saldo;
      }

      return total;
    }

    public mediaSaldo (): number {
      return this.saldoBanco() / this.qtdContas()
    }
}


let poupanca: Poupanca = new Poupanca("123", "João", 0.5);
poupanca.depositar(100);
console.log(poupanca.saldo);