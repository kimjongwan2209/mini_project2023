import express from "express";
import { users } from "../model/userSchema.js";
import { token } from "../model/tokenSchema.js";
import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "../checked_function/sendMail.js";
import {
  checked_user_id,
  checked_user_password,
  checked_user_phone,
} from "../checked_function/checked_id.js";
import {
  checkValidationPhone,
  getToken,
  sendTokenToSMS,
} from "../checked_function/checked_token.js";
import { createBoardAPI } from "../scrapping/scraping.js";

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//회원가입로직

router.post("/user", async (req, res) => {
  const { name, email, personal, prefer, pwd, phone } = req.body;

  //스크래핑
  const data_scrapping = await createBoardAPI(prefer);

  //패스워드 검증
  const check_pwd = checked_user_password(pwd);
  if (check_pwd === false) {
    return res
      .status(400)
      .json({ message: "패스워드 값이 올바르지 않습니다." });
  }

  //전화번호 검증
  const check_phone = checked_user_phone(phone);
  if (check_phone === false) {
    return res
      .status(400)
      .json({ message: "전화번호 입력이 올바르지 않습니다." });
  }

  //유저네임 검증
  const check_name = checked_user_id(name);
  if (check_name === false) {
    return res.status(400).json({ message: "입력된 값이 올바르지 않습니다." });
  } else {
    const isValidEmail = checkEmail(email);
    if (isValidEmail === false) {
      return res
        .status(400)
        .json({ message: "이메일 형식이 올바르지 않거나 공백이 존재합니다." });
    } else if (isValidEmail !== false) {
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
      pwd: check_pwd,
      phone: check_phone,
      site: data_scrapping,
    });
    return res.status(200).json({ _id: user_id._id });
  }
});

//전화번호 토큰 발급
router.post("/tokens/phone", async (req, res) => {
  const { phone } = req.body;

  const phoneNumber = await token.findOne({ phone });
  if (!phoneNumber) {
    const new_token = getToken();
    if (new_token === false) {
      return res.status(400).json({ message: "숫자가 올바르지 않습니다." });
    } else return await token.create({ new_token, phone, isAuth: false });
  }
  if (phoneNumber.token) {
    const new_token = getToken();
    await token.updateOne({ new_token });
    sendTokenToSMS(phone, new_token);
    return res.status(200).json({
      message: `${phone}으로 인증 문자가 전송되었습니다.`,
    });
  }
});

//유저목록 불러오기
router.get("/users", async (req, res) => {
  const user_information = await users.find({});
  return res.status(200).json({ data: user_information });
});

export default router;
