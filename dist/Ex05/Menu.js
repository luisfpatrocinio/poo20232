"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const banco_1 = require("./banco");
const conta_1 = require("./conta");
let input = (0, prompt_sync_1.default)();
let b = new banco_1.Banco();
let opcao = '';
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
    opcao = input("Opção:");
    switch (opcao) {
        case "1":
            inserir();
            break;
        case "2":
            consultar();
            break;
        //...
    }
    input("Operação finalizada. Digite <enter>");
} while (opcao != "0");
console.log("Aplicação encerrada");
function inserir() {
    console.log("\nCadastrar conta\n");
    let numero = input('Digite o número da conta:');
    let conta;
    conta = new conta_1.Conta(numero, "0", 0);
    b.inserir(conta);
}
function consultar() {
}
function main() {
    print("Hello World!");
}
main();
