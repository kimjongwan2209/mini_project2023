import express from "express";
import { startCrawling } from "../webcrawler/coffee_crawler.js";
import { starbucks } from "../model/starbucksSchema.js";

const router = express.Router();

router.get("/starbucks", async (req, res) => {
  const coffee_information = await starbucks.find({});
  return res.status(200).json({ data: coffee_information });
});

export default router;
