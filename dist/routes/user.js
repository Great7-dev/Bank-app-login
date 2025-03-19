"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.post("/create", user_1.RegisterUser);
router.post("/login", user_1.LoginUser);
router.get("/:customerID", user_1.getUser);
exports.default = router;
