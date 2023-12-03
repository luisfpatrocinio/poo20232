import { Account } from "../account";

export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppError";
    }
}

export class NegativeValueError extends AppError {
    constructor(message: string = "O valor não pode ser negativo.") {
        super(message);
        this.name = "NegativeValueError";
    }
}

export class InsufficientFundsError extends AppError {
    constructor(message: string = "Saldo insuficiente.") {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

// Exceções de Contas
export class AccountError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "AccountError";
    }
}

export class AccountNotFoundError extends AccountError {
    constructor(message: string) {
        super(message);
        this.name = "AccountNotFoundError";
    }
}

export class TransferToYourselfError extends AccountError {
    constructor(message: string) {
        super(message);
        this.name = "TransferToYourselfError";
    }
}

// Exceções de Usuário
export class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserError";
    }
}

export class UserCancelError extends UserError {
    constructor(message: string = "Ação cancelada pelo usuário.") {
        super(message);
        this.name = "UserCancelError";
    }
}