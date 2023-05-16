import express from "express";
import loginRouter from "./login.js";
import starbucksRouter from "./starbucks.js";
const router = express.Router();

router.use("/", [loginRouter]);
router.use("/", [starbucksRouter]);

export default router;
