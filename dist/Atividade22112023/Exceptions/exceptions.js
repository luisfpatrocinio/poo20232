"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotFoundError = exports.AccountError = exports.InsufficientFundsError = exports.NegativeValueError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = "AppError";
    }
}
exports.AppError = AppError;
class NegativeValueError extends AppError {
    constructor() {
        super("O valor não pode ser negativo.");
        this.name = "NegativeValueError";
    }
}
exports.NegativeValueError = NegativeValueError;
class InsufficientFundsError extends AppError {
    constructor() {
        super("Saldo insuficiente.");
        this.name = "InsufficientFundsError";
    }
}
exports.InsufficientFundsError = InsufficientFundsError;
class AccountError extends AppError {
    constructor(message) {
        super("Erro relacionado a conta.");
        this.name = "AccountError";
    }
}
exports.AccountError = AccountError;
class AccountNotFoundError extends AccountError {
    constructor(message) {
        super(message);
        this.name = "AccountNotFoundError";
    }
}
exports.AccountNotFoundError = AccountNotFoundError;
