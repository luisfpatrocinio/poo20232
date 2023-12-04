import { ITributavel } from "./tributavel";

export class AuditoriaInterna {
    private _tributaveis: Array<ITributavel> = new Array<ITributavel>;

    public adicionar(tributavel: ITributavel): void {
        this._tributaveis.push(tributavel);
    }


    public calcularTributo(): number {
        const total = this._tributaveis.reduce((acc, tributavel) => {
            return acc + tributavel.calculaTributos();
        }, 0);

        return total;
    }


}