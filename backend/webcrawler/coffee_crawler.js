import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { starbucks } from "../model/starbucksSchema.js";

export async function startCrawling() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://www.starbucks.co.kr/menu/drink_list.do");
  await page.waitForTimeout(1500);

  for (let i = 1; i <= 10; i++) {
    const image = await page.$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2) > ul > li:nth-child(${i}) > dl > dt > a > img`,
      (el) => el.src
    );

    const name = await page.$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2) > ul > li:nth-child(${i}) > dl > dd`,
      (el) => el.textContent
    );

    console.log(`이름: ${name}, 이미지: ${image}`);

    const starbucks_db = new starbucks({
      name: name,
      img: image,
    });
    await starbucks_db.save();
  }
  await browser.close();
}
startCrawling();
