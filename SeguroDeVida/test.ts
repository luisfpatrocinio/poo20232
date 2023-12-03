import { AuditoriaInterna } from "./auditoriaInterna";
import { Conta, ContaCorrente } from "./conta";
import { SeguroDeVida } from "./seguroDeVida";

class Test {
    private _auditoria: AuditoriaInterna = new AuditoriaInterna
    run() {
        console.log("Iniciando testes.........");
        let c1 = new ContaCorrente("João", 500);
        let c2 = new ContaCorrente("Pedro", 200);
        // let c3 = new ContaCorrente("Maria", 3000);
        let s1 = new SeguroDeVida();
        let s2 = new SeguroDeVida();

        this._auditoria.adicionar(c1);
        this._auditoria.adicionar(c2);
        // this._auditoria.adicionar(c3);
        this._auditoria.adicionar(s1);
        this._auditoria.adicionar(s2);

        console.log("Resultado dos tributos: ", this._auditoria.calcularTributo());
    }
}

function main() {
    let test = new Test();
    test.run();
}

main();