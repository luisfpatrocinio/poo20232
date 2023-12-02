import { AppError } from "../Exceptions/exceptions";
import { clearTerminal } from "./visualUtils";

export class Stack<T> {
    private elements: T[] = [];

    push(element: T): void {
        this.elements.push(element);
    }

    pop(): T | undefined {
        return this.elements.pop();
    }

    peek(): T | undefined {
        if (this.elements.length == 0) return undefined;
        return this.elements[this.elements.length - 1];
    }

    isEmpty(): boolean {
        return this.elements.length == 0;
    }
}

/**
 * Exibe o cabeçalho.
 * @param header - O texto a ser exibido
 */
export function showHeader(header: string) {
    clearTerminal();
    showCenterText(header);
}

export function showCenterText(text: string) {
    let width = getTerminalWidth();
    let spaces = width/2 - text.length/2;
    console.log(`${" ".repeat(spaces)}${text}`)
}

function getTerminalHeight(): number {
    return process.stdout.rows;
}

function getTerminalWidth(): number {
    return process.stdout.columns;
}

export function showError(error: AppError) {
    let _totalWidth = getTerminalWidth();
    let _boxWidth = Math.floor(_totalWidth * 8 / 10);
    let _border = (_totalWidth - _boxWidth) / 2;
    console.log(`${" ".repeat(_border)}${".".repeat(_boxWidth)}`);
    showCenterText(error.message);
    showCenterText(`Tipo: ${error.name}`);
    console.log(`${" ".repeat(_border)}${".".repeat(_boxWidth)}`);
}