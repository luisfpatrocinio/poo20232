import { Tributavel } from "./tributavel";

export class AuditoriaInterna {
    private _tributaveis: Array<Tributavel> = new Array<Tributavel>;

    public adicionar(tributavel: Tributavel): void {
        this._tributaveis.push(tributavel);
    }


    public calcularTributo(): number {
        const total = this._tributaveis.reduce((acc, tributavel) => {
            return acc + tributavel.calculaTributos();
        }, 0);

        return total;
    }


}