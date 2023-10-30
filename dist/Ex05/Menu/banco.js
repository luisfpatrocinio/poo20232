"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banco = void 0;
const conta_1 = require("./conta");
class Banco {
    constructor() {
        this.contas = [];
    }
    inserir(conta) {
        if (this.consultar(conta.numero) == null) {
            this.contas.push(conta);
        }
    }
    consultar(numero) {
        let contaProcurada = null;
        for (let i = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                contaProcurada = this.contas[i];
                break;
            }
        }
        return contaProcurada;
    }
    consultarPorIndice(numero) {
        let indiceProcurado = -1;
        for (let i = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                indiceProcurado = i;
                break;
            }
        }
        return indiceProcurado;
    }
    alterar(conta) {
        let indiceProcurado = this.consultarPorIndice(conta.numero);
        if (indiceProcurado != -1) {
            this.contas[indiceProcurado] = conta;
        }
    }
    excluir(numero) {
        let indiceProcurado = this.consultarPorIndice(numero);
        if (indiceProcurado != -1) {
            for (let i = indiceProcurado; i < this.contas.length; i++) {
                this.contas[i] = this.contas[i + 1];
            }
            this.contas.pop();
        }
    }
    sacar(numero, valor) {
        let indiceProcurado = this.consultarPorIndice(numero);
        if (indiceProcurado != -1) { //Achou uma conta
            let conta = this.contas[indiceProcurado];
            conta.sacar(valor);
        }
    }
    transferir(numeroCredito, numeroDebito, valor) {
        let indiceOrigem = this.consultarPorIndice(numeroDebito);
        let indiceDestino = this.consultarPorIndice(numeroCredito);
        if (indiceDestino != -1 && indiceOrigem != -1) {
            let contaDestino = this.contas[indiceDestino];
            let contaOrigem = this.contas[indiceOrigem];
            contaOrigem.transferir(contaDestino, valor);
        }
    }
    qtdContas() {
        let qtd = this.contas.length;
        return qtd;
    }
    saldoBanco() {
        let total = 0;
        for (let conta of this.contas) {
            total += conta.saldo;
        }
        return total;
    }
    mediaSaldo() {
        return this.saldoBanco() / this.qtdContas();
    }
}
exports.Banco = Banco;
let poupanca = new conta_1.Poupanca("123", "João", 0.5);
poupanca.depositar(100);
console.log(poupanca.saldo);
