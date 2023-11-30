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