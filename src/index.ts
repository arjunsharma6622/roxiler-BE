import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/connectDB";
import { errorHandler } from "./middlewares/errorHandler";
import transactionRoutes from "./routes/transaction.routes";
import cors from "cors";

dotenv.config();

const app = express();

connectDB();

const corsOptions = {
    origin: ["http://localhost:5173", "*"],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  
  app.use(cors(corsOptions));

app.use("/api/transaction", transactionRoutes)

const PORT = process.env.PORT || 8000;

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on PORT - ${PORT}`)
})