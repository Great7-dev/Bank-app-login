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
exports.getUser = exports.LoginUser = exports.RegisterUser = void 0;
const validation_1 = require("../utils/validation");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RegisterUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        const ValidateUser = validation_1.CreateSchema.validate(req.body, validation_1.options);
        if (ValidateUser.error) {
            return res
                .status(400)
                .json({ Error: ValidateUser.error.details[0].message });
        }
        // Create new user instance
        const newUser = new user_1.default({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            customerID: req.body.customerID,
            twoFactorAuth: "",
        });
        // Save user to database
        const record = yield newUser.save();
        return res.status(201).json({
            status: "Success",
            msg: "User created successfully",
            record,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to register user",
            route: "/create",
        });
    }
});
exports.RegisterUser = RegisterUser;
const LoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { customerID } = req.body;
        if (!customerID) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }
        // Check if user exists
        const user = yield user_1.default.findOne({ customerID });
        if (!user) {
            return res.status(401).json({ msg: "Invalid Customer ID" });
        }
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ id: user._id, customerID: user.customerID }, process.env.JWT_SECRET, // Ensure `JWT_SECRET` is set in .env
        { expiresIn: "1h" });
        return res.status(200).json({
            status: "Success",
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                customerID: user.customerID,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.LoginUser = LoginUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerID } = req.params; // Extract customerID from URL parameters
        if (!customerID) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }
        // Find user by customerID and return only the 'firstname' and 'lastname' fields
        const user = yield user_1.default.findOne({ customerID }, { firstname: 1, lastname: 1, _id: 0 } // Correct projection
        );
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Failed to get user",
            route: "/users",
        });
    }
});
exports.getUser = getUser;
