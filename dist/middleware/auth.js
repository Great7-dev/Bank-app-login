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
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const user_1 = __importDefault(require("../models/user"));
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                res.status(401);
                res.json({
                    Error: "kindly sign in as a user",
                });
            }
            //hide part of the token
            const token = (authorization === null || authorization === void 0 ? void 0 : authorization.slice(7, authorization.length)) ||
                req.cookies.mytoken;
            const verified = jsonwebtoken_1.default.verify(token, secret);
            if (!verified) {
                res.status(401);
                res.json({
                    Error: "User not verified, you cant access this route",
                });
                return;
            }
            const { id } = verified;
            const user = yield user_1.default.findOne({ where: { id } });
            if (!user) {
                res.status(404);
                res.json({
                    Error: "user not verified",
                });
                return;
            }
            req.user = verified;
            next();
        }
        catch (error) {
            res.status(500);
            res.json({
                Error: "user not logged in",
            });
            return;
        }
    });
}
