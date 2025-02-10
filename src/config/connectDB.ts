import mongoose from "mongoose";
import dotenv from "dotenv";
import { customError } from "../helpers/customError";
dotenv.config();

export const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;

        if (!mongoURL) {
            throw new customError("MongoDB URL not provided!", 404);
        }

        await mongoose.connect(mongoURL);

        console.log(`DB Connected Successfully!`);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};