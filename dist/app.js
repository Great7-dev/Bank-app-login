"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const config_db_1 = __importDefault(require("./config/config.db"));
const user_1 = __importDefault(require("./routes/user"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, config_db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json()); // ✅ Middleware to parse JSON
app.use("/users", user_1.default); // ✅ Use routes under "/users"
// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to TypeScript Express API with MongoDB!" });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
