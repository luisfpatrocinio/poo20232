"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewUtils_1 = require("../Utils/viewUtils");
class View {
    constructor() {
        this._width = (0, viewUtils_1.obterLarguraTerminal)() - 4;
        this._height = (0, viewUtils_1.obterAlturaTerminal)() - 4;
    }
    autoSize() {
        this._width = (0, viewUtils_1.obterLarguraTerminal)() - 4;
        this._height = (0, viewUtils_1.obterAlturaTerminal)() - 4;
    }
}
