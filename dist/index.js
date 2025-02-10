"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const connectDB_1 = require("./config/connectDB");
const errorHandler_1 = require("./middlewares/errorHandler");
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, connectDB_1.connectDB)();
const corsOptions = {
    origin: ["http://localhost:5173", "http://roxiler.arjunsharma.dev", "*"],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use("/api/transaction", transaction_routes_1.default);
const PORT = process.env.PORT || 8000;
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on PORT - ${PORT}`);
});
