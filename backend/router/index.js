import express from "express";
import signRouter from "./sign_up.js";
import starbucksRouter from "./starbucks.js";
import loginRouter from "./login.js";
import cookieParser from "cookie-parser";

const router = express.Router();

router.use(cookieParser());
router.use("/", [signRouter]);
router.use("/", [starbucksRouter]);
router.use("/", [loginRouter]);

export default router;
