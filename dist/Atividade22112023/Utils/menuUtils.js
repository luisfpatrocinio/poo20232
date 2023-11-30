"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor() {
        this.elements = [];
    }
    push(element) {
        this.elements.push(element);
    }
    pop() {
        return this.elements.pop();
    }
    peek() {
        if (this.elements.length == 0)
            return undefined;
        return this.elements[this.elements.length - 1];
    }
    isEmpty() {
        return this.elements.length == 0;
    }
}
exports.Stack = Stack;
