"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
class customError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.customError = customError;
