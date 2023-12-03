import { Tributavel } from "./tributavel";

export class SeguroDeVida implements Tributavel {
    calculaTributos(): number {
        return 50;
    }
}