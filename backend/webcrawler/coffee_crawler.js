import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { starbucks } from "../model/starbucksSchema.js";

export async function startCrawling() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.starbucks.co.kr/menu/drink_list.do");
  await page.waitForTimeout(2400);

  const cnt = await page.$$eval(
    `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd `,
    (data) => data.length
  );
  console.log(cnt);

  for (let i = 1; i <= cnt; i++) {
    const second_cnt = await page.$$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${i}) > ul > li`,
      (data) => data.length
    );

    for (let j = 1; j <= second_cnt; j++) {
      const image = await page.$eval(
        `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${i}) > ul > li:nth-child(${j}) > dl > dt > a > img`,
        (el) => el.src
      );

      const name = await page.$eval(
        `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${i}) > ul > li:nth-child(${j}) > dl > dd`,
        (el) => el.textContent
      );

      console.log(`이름: ${name}, 이미지: ${image}`);

      const starbucks_db = await starbucks.updateOne(
        { name: name },
        { img: image },
        { upsert: true }
      );
    }
  }
  await browser.close();
}
startCrawling();
