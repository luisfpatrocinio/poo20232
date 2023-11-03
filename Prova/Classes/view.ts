import { obterAlturaTerminal, obterLarguraTerminal } from "../Utils/viewUtils";

class View {
    private _width: number;
    private _height: number;

    constructor() {
        this._width = obterLarguraTerminal() - 4;
        this._height = obterAlturaTerminal() - 4;
    }

    autoSize(): void {
        this._width = obterLarguraTerminal() - 4;
        this._height = obterAlturaTerminal() - 4;
    }


}