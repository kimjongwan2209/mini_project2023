import express from "express";
import { users } from "../model/userSchema.js";
import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "../checked_function/sendMail.js";
import { checked_user_id } from "../checked_function/checked_id.js";
import { createBoardAPI } from "../scrapping/scraping.js";

const router = express.Router();

//회원가입
router.post("/user", async (req, res) => {
  const { name, email, personal, prefer, pwd, phone } = req.body;

  const check_name = await checked_user_id(name);
  const data_scrapping = await createBoardAPI(prefer);

  const isValidEmail = checkEmail(email);
  if (isValidEmail) {
    // 2. 가입환영 템플릿 만들기
    const mytemplate = getWelcomeTemplate(name, email, phone, prefer);
    sendTemplateToEmail(email, mytemplate);
  }

  if (!personal.includes("-")) {
    console.log("에러 발생!!! 형식이 올바르지 않습니다!!!");
    return;
  }
  // 주민번호 숫자갯수가 맞지 않았을 경우 검증 로직
  const parts = personal.split("-");
  if (parts.length !== 2 || parts[0].length !== 6 || parts[1].length !== 7) {
    console.log("에러 발생!!! 개수를 제대로 입력해 주세요!!!");
    return;
  }
  //최종 출력 로직
  const masked = parts[1].substr(0, 1) + "******";
  console.log(name, email, masked, prefer, pwd, phone, data_scrapping);
  const user_id = await users.create({
    name: check_name,
    email,
    personal: masked,
    prefer,
    pwd,
    phone,
    site: data_scrapping,
  });
  return res.status(200).json({ _id: user_id._id });
});

//유저목록 불러오기
router.get("/users", async (req, res) => {
  const user_information = await users.find({});
  return res.status(200).json({ data: user_information });
});

export default router;
