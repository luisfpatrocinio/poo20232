"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCancelError = exports.UserError = exports.TransferToYourselfError = exports.AccountNotFoundError = exports.AccountError = exports.InsufficientFundsError = exports.NegativeValueError = exports.AppError = void 0;
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
    constructor(message = "Saldo insuficiente.") {
        super(message);
        this.name = "InsufficientFundsError";
    }
}
exports.InsufficientFundsError = InsufficientFundsError;
// Exceções de Contas
class AccountError extends AppError {
    constructor(message) {
        super(message);
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
class TransferToYourselfError extends AccountError {
    constructor(message) {
        super(message);
        this.name = "TransferToYourselfError";
    }
}
exports.TransferToYourselfError = TransferToYourselfError;
// Exceções de Usuário
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserError";
    }
}
exports.UserError = UserError;
class UserCancelError extends UserError {
    constructor(message) {
        super(message);
        this.name = "UserCancelError";
    }
}
exports.UserCancelError = UserCancelError;
