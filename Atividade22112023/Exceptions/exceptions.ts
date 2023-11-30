export class AppError extends Error {
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

export class AccountError extends AppError {
    constructor(message: string) {
        super("Erro relacionado a conta.");
        this.name = "AccountError";
    }
}

export class AccountNotFoundError extends AccountError {
    constructor(message: string) {
        super(message);
        this.name = "AccountNotFoundError";
    }
}