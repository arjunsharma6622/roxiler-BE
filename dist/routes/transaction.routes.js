"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const checkValidMonth_1 = require("../middlewares/checkValidMonth");
const router = express_1.default.Router();
router.get("/initializedata", transaction_controller_1.initializeTransaction);
router.get("/all", checkValidMonth_1.checkValidMonth, transaction_controller_1.getAllTransactions);
router.get("/stats", checkValidMonth_1.checkValidMonth, transaction_controller_1.getMonthStats);
router.get("/piechart", checkValidMonth_1.checkValidMonth, transaction_controller_1.getUniqueCategories);
router.get("/barchart", checkValidMonth_1.checkValidMonth, transaction_controller_1.getItemsSoldInPriceRange);
exports.default = router;
