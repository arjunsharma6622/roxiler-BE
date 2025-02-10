"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidMonth = void 0;
const customError_1 = require("../helpers/customError");
const checkValidMonth = (req, res, next) => {
    const { month } = req.query;
    if (!month) {
        throw new customError_1.customError("Please provide month", 400);
    }
    if (Number(month) < 1 || Number(month) > 12) {
        throw new customError_1.customError("Invalid month", 400);
    }
    next();
};
exports.checkValidMonth = checkValidMonth;
