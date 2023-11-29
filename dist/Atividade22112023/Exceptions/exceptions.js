"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientFundsError = exports.NegativeValueError = void 0;
class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = "AppError";
    }
}
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
