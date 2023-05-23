import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { starbucks } from "../model/starbucksSchema.js";

export async function startCrawling() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://www.starbucks.co.kr/menu/drink_list.do");
    await page.waitForTimeout(5000);
  } catch (err) {
    const err_mesaage = "연결 중 오류가 발생하였습니다.";
    throw Error("브라우저를 실행 할 수 없습니다." + err);
    console.log(err_mesaage, err);
  }

  const cnt = await page.$$eval(
    `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd`,
    (data) => data.length
  );

  console.log(cnt);

  for (let i = 1; i <= cnt * 2; i++) {
    const second_cnt = await page.$$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${i}) > ul > li`,
      (data) => data.length
    );
    console.log(second_cnt);

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
