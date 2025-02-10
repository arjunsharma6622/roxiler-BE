"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueCategories = exports.getItemsSoldInPriceRange = exports.getMonthStats = exports.getAllTransactions = exports.initializeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Transaction_1 = require("../models/Transaction");
exports.initializeTransaction = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSource = `https://s3.amazonaws.com/roxiler.com/product_transaction.json`;
    const { data: transactionsFromDataSoruce } = yield axios_1.default.get(dataSource);
    const savedTransactionsInDB = yield Transaction_1.Transaction.insertMany(transactionsFromDataSoruce);
    res.status(200).json({
        success: true,
        message: "Initialized Data in DB!",
        data: savedTransactionsInDB
    });
}));
exports.getAllTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, searchText, month } = req.query;
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const baseQuery = {};
    if (month) {
        baseQuery.$expr = {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        };
    }
    const totalItems = yield Transaction_1.Transaction.countDocuments(baseQuery);
    if (searchText) {
        baseQuery.$or = [
            { title: { $regex: searchText, $options: "i" } },
            { description: { $regex: searchText, $options: "i" } },
            { price: !isNaN(Number(searchText)) ? Number(searchText) : null }
        ];
    }
    const transactions = yield Transaction_1.Transaction.find(baseQuery)
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
    const dataToSend = {
        transactions,
        total: totalItems
    };
    res.status(200).json({
        success: true,
        message: "All Transactions in DB!",
        data: dataToSend
    });
}));
exports.getMonthStats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    const transactions = yield Transaction_1.Transaction.find({
        $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        }
    }).lean();
    let totalSaleAmount = 0, totalSoldItems = 0, totalUnsoldItems = 0;
    for (const t of transactions) {
        totalSaleAmount += t.price;
        totalSoldItems += t.sold ? 1 : 0;
        totalUnsoldItems += !t.sold ? 1 : 0;
    }
    res.status(200).json({
        success: true,
        message: `Transactions for month ${month}`,
        data: {
            totalSaleAmount,
            totalSoldItems,
            totalUnsoldItems
        }
    });
}));
exports.getItemsSoldInPriceRange = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    const transactions = yield Transaction_1.Transaction.find({
        $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        }
    }).lean();
    const rangeItemsMap = new Map();
    for (const t of transactions) {
        const bracketNumber = Math.floor(t.price / 100) > 9 ? 9 : Math.floor(t.price / 100);
        if (!rangeItemsMap.has(bracketNumber)) {
            rangeItemsMap.set(bracketNumber, 1);
        }
        else {
            rangeItemsMap.set(bracketNumber, rangeItemsMap.get(bracketNumber) + 1);
        }
    }
    const dataToSend = new Array(10).fill(0);
    for (let i = 0; i < 10; i++) {
        dataToSend[i] = rangeItemsMap.has(i) ? rangeItemsMap.get(i) : 0;
    }
    res.status(200).json({
        success: true,
        message: `Transactions for month ${month}`,
        data: dataToSend
    });
}));
exports.getUniqueCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    const transactions = yield Transaction_1.Transaction.find({
        $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        }
    }).lean();
    const uniqueCategories = new Map();
    for (const t of transactions) {
        if (!uniqueCategories.has(t.category)) {
            uniqueCategories.set(t.category, 1);
        }
        else {
            uniqueCategories.set(t.category, uniqueCategories.get(t.category) + 1);
        }
    }
    const dataToSend = [];
    for (const c of uniqueCategories.entries()) {
        dataToSend.push(c);
    }
    res.status(200).json({
        success: true,
        message: `Transactions for month ${month}`,
        data: {
            uniqueCategories: dataToSend
        }
    });
}));
