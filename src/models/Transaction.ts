import mongoose from "mongoose";
import { TransactionType } from "../types/Transaction";

const transactionSchema = new mongoose.Schema<TransactionType>({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price : { type : Number, required : true},
    description : { type : String, required : true},
    category : { type : String, required : true},
    image : { type : String, required : true},
    sold : { type : Boolean, required : true},
    dateOfSale : { type : String, required : true}
})

export const Transaction = mongoose.model<TransactionType>("Transaction", transactionSchema);
