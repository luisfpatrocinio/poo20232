import {AppError} from '../Exceptions/exceptions';
import {question, keyInPause} from 'readline-sync';

export function getText(msg: string): string {
    // Validar texto:
    // - Não pode ser vazio
    // - Não pode conter caracteres especiais
    
    let _text: string = question(msg);
    if (_text.trim().length <= 0) {
        throw new AppError("O texto não pode ser vazio.");
    }
    return _text;
}

export function enterToContinue(): void {
    var readline = require('readline');

    var _text = "[C/Espaço - Continuar]";
    var _x = Math.floor(getTerminalWidth()/2 - _text.length/2);
    readline.cursorTo(process.stdout, _x);
    // console.log(chalk.bgHex(obterCorDoFundo())(_text));
    console.log(_text);
    keyInPause('', {mask: '', limit: 'c '})
}

function getTerminalWidth(): number {
    return process.stdout.columns;
}
