import { NextFunction, Request, Response } from "express";
import { customError } from "../helpers/customError";

export const checkValidMonth = (req : Request, res : Response, next : NextFunction) => {
    const { month } = req.query;

    if (!month) {
        throw new customError("Please provide month", 400);
    }

    if (Number(month) < 1 || Number(month) > 12) {
        throw new customError("Invalid month", 400);
    }

    next();
}