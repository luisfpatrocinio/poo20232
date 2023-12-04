"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileNotFoundError = void 0;
const appError_1 = require("./appError");
class ProfileNotFoundError extends appError_1.AppError {
    constructor(message = "Perfil não encontrado.") {
        super(message);
        this.name = "ProfileNotFoundError";
    }
}
exports.ProfileNotFoundError = ProfileNotFoundError;
