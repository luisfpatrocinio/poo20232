"use strict";
// Fazer um Reduce
class Continha {
    constructor(_id, _saldo) {
        this.id = _id;
        this.saldo = _saldo;
    }
}
function main() {
    let b1 = new Continha("000", 1000);
    console.log(b1);
}
main();
