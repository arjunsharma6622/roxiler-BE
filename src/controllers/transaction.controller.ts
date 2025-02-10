import axios from "axios"
import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Transaction } from "../models/Transaction"

export const initializeTransaction = asyncHandler(async (req: Request, res: Response) => {
    const dataSource = `https://s3.amazonaws.com/roxiler.com/product_transaction.json`

    const { data: transactionsFromDataSoruce } = await axios.get(dataSource);

    const savedTransactionsInDB = await Transaction.insertMany(transactionsFromDataSoruce);

    res.status(200).json({
        success: true,
        message: "Initialized Data in DB!",
        data: savedTransactionsInDB
    })
})

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {

    const { page, limit, searchText, month } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const itemsPerPage = parseInt(limit as string) || 10;

    const baseQuery: any = {};

    if(month){
        baseQuery.$expr = {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        };
    }

    const totalItems = await Transaction.countDocuments(baseQuery);

    if (searchText) {
        baseQuery.$or = [
            { title: { $regex: searchText, $options: "i" } },
            { description: { $regex: searchText, $options: "i" } },
            { price: !isNaN(Number(searchText)) ? Number(searchText) : null }
        ];
    }

    const transactions = await Transaction.find(baseQuery)
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);


    const dataToSend = {
        transactions,
        total: totalItems
    }

    res.status(200).json({
        success: true,
        message: "All Transactions in DB!",
        data: dataToSend
    })
})

export const getMonthStats = asyncHandler(async (req: Request, res: Response) => {

    const { month } = req.query;

    const transactions = await Transaction.find({
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
})

export const getItemsSoldInPriceRange = asyncHandler(async (req: Request, res: Response) => {

    const { month } = req.query;

    const transactions = await Transaction.find({
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
            rangeItemsMap.set(bracketNumber, rangeItemsMap.get(bracketNumber)+1);
        }
    }

    const dataToSend = new Array(10).fill(0);

    for(let i=0; i<10; i++){
        dataToSend[i] = rangeItemsMap.has(i) ? rangeItemsMap.get(i) : 0;
    }

    res.status(200).json({
        success: true,
        message: `Transactions for month ${month}`,
        data: dataToSend
    });
})

export const getUniqueCategories = asyncHandler(async (req: Request, res: Response) => {

    const { month } = req.query;

    const transactions = await Transaction.find({
        $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: "$dateOfSale" } } }, Number(month)]
        }
    }).lean();

    const uniqueCategories = new Map();

    for (const t of transactions) {
        if (!uniqueCategories.has(t.category)) {
            uniqueCategories.set(t.category, 1);
        } else {
            uniqueCategories.set(t.category, uniqueCategories.get(t.category) + 1);
        }
    }

    const dataToSend = [];

    for (const c of uniqueCategories.entries()) {
        dataToSend.push(c)
    }

    res.status(200).json({
        success: true,
        message: `Transactions for month ${month}`,
        data: {
            uniqueCategories: dataToSend
        }
    });
})