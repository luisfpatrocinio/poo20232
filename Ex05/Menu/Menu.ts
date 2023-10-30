import { question } from 'readline-sync';
import { Banco } from "./banco";
import { Conta } from "./conta";

let b: Banco = new Banco();
let opcao: String = '';

function inserir(): void {
    console.log("\nCadastrar conta\n");
    let numero: string = question('Digite o número da conta:');
    let conta: Conta;
    conta = new Conta(numero, "0", 0);
    b.inserir(conta);
}

function consultar(): void {
    
}

function main() {
    do {
        console.log('\nBem vindo\nDigite uma opção:');
        console.log(`
    1 - Cadastrar 
    2 - Consultar 
    3 - Sacar
    4 - Depositar 
    5 - Excluir 
    6 - Transferir
    7 – Totalizações
    0 - Sair`);
        opcao = question("Opção:");
        switch (opcao) {
            case "1":
                inserir();
                break
            case "2":
                consultar();
                break
            //...
        }
        question("Operação finalizada. Digite <enter>");
    } while (opcao != "0");
    console.log("Aplicação encerrada");
}

main();