import { ITributavel } from "./tributavel";

export class SeguroDeVida implements ITributavel {
    calculaTributos(): number {
        return 50;
    }
}