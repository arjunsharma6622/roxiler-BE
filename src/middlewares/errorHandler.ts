import { NextFunction, Request, Response } from "express";
import { customError } from "../helpers/customError";

export const errorHandler = (err: customError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error!"
    })
}