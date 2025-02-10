import express from "express";
import { getAllTransactions, getItemsSoldInPriceRange, getMonthStats, getUniqueCategories, initializeTransaction } from "../controllers/transaction.controller";
import { checkValidMonth } from "../middlewares/checkValidMonth";

const router = express.Router()

router.get("/initializedata", initializeTransaction)
router.get("/all", checkValidMonth, getAllTransactions)
router.get("/stats", checkValidMonth, getMonthStats)
router.get("/piechart", checkValidMonth, getUniqueCategories)
router.get("/barchart", checkValidMonth, getItemsSoldInPriceRange)

export default router;