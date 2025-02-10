"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error!"
    });
};
exports.errorHandler = errorHandler;
