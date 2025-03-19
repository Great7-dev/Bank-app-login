import express from "express";

import { RegisterUser, LoginUser, getUser } from "../controller/user";
import { auth } from "../middleware/auth";

const router = express.Router();
router.post("/create", RegisterUser);
router.post("/login", LoginUser);
router.get("/:customerID", getUser);

export default router;
