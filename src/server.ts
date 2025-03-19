import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/config.db";
import userRoutes from "./routes/user";

// Load environment variables
dotenv.config();

// Connect to MongoDB

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // ✅ Middleware to parse JSON
app.use("/users", userRoutes); // ✅ Use routes under "/users"

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to TypeScript Express API with MongoDB!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
