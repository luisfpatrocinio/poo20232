"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = require("readline-sync");
const banco_1 = require("./banco");
const conta_1 = require("./conta");
let b = new banco_1.Banco();
let opcao = '';
function inserir() {
    console.log("\nCadastrar conta\n");
    let numero = (0, readline_sync_1.question)('Digite o número da conta:');
    let conta;
    conta = new conta_1.Conta(numero, "0", 0);
    b.inserir(conta);
}
function consultar() {
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
        opcao = (0, readline_sync_1.question)("Opção:");
        switch (opcao) {
            case "1":
                inserir();
                break;
            case "2":
                consultar();
                break;
            //...
        }
        (0, readline_sync_1.question)("Operação finalizada. Digite <enter>");
    } while (opcao != "0");
    console.log("Aplicação encerrada");
}
main();
