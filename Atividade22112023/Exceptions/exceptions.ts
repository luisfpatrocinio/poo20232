class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppError";
    }
}

export class NegativeValueError extends AppError {
    constructor() {
        super("O valor não pode ser negativo.");
        this.name = "NegativeValueError";
    }
}

export class InsufficientFundsError extends AppError {
    constructor() {
        super("Saldo insuficiente.");
        this.name = "InsufficientFundsError";
    }
}