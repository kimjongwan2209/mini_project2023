import express from "express";
import { users } from "../model/userSchema.js";
import { tokens } from "../model/tokenSchema.js";
import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "../checked_function/sendMail.js";
import {
  checked_user_id,
  checked_user_password,
  checked_user_personal,
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
  const check_pwd = await checked_user_password(pwd);
  if (check_pwd === false) {
    return res
      .status(400)
      .json({ message: "패스워드 형식이 올바르지 않습니다." });
  }
  const encryption = check_pwd;

  //전화번호 검증
  const check_phone = checked_user_phone(phone);
  if (check_phone === false) {
    return res
      .status(400)
      .json({ message: "전화번호 입력이 올바르지 않습니다." });
  }

  //주민등록번호 검증
  const check_personal = checked_user_personal(personal);
  if (check_personal === false) {
    return res
      .status(400)
      .json({ message: "주민등록번호가 올바르지 않습니다." });
  }
  const masked = check_personal;

  //유저네임 검증
  const user_id_check_in_db = await users.find({ name: name });
  if (user_id_check_in_db.length !== 0) {
    return res
      .status(400)
      .json({ message: `${name}는(은) 이미 존재하는 아이디입니다.` });
  } else {
    const check_name = checked_user_id(name);
    if (check_name === false) {
      return res
        .status(400)
        .json({ message: "입력된 값이 올바르지 않습니다." });
    } else {
      const isValidEmail = checkEmail(email);
      if (isValidEmail === false) {
        return res.status(400).json({
          message: "이메일 형식이 올바르지 않거나 공백이 존재합니다.",
        });
      } else if (isValidEmail !== false) {
        // 2. 가입환영 템플릿 만들기
        const mytemplate = getWelcomeTemplate(name, email, phone, prefer);
        sendTemplateToEmail(email, mytemplate);
      }

      const user_id = await users.create({
        name,
        email,
        personal: masked,
        prefer,
        pwd: encryption,
        phone,
        site: data_scrapping,
      });
      return res
        .status(200)
        .json({ _id: user_id._id, message: "가입을 축하합니다." });
    }
  }
});

//전화번호 토큰 발급
router.post("/tokens/phone", async (req, res) => {
  const { phone } = req.body;

  const phoneNumber = await tokens.findOne({ phone });
  if (!phoneNumber) {
    const new_token = getToken();
    if (new_token === false) {
      return res.status(400).json({ message: "숫자가 올바르지 않습니다." });
    } else
      await tokens.create({ token: new_token, phone: phone, isAuth: false });
  } else {
    const new_token = getToken();
    await tokens.updateOne({ token: new_token });
    sendTokenToSMS(phone, new_token);
    return res.status(200).json({
      message: `${phone}으로 인증 문자가 전송되었습니다.`,
    });
  }
});

//전화번호 토큰 인증
router.patch("/tokens/phone", async (req, res) => {
  const { phone, token } = req.body;
  const phoneNumber = await tokens.findOne({ phone });
  if (!phoneNumber) {
    return res.status(400).json({ message: "존재하지 않는 번호입니다." });
  }
  if (phoneNumber.token !== token) {
    return res
      .status(400)
      .json({ message: "입력하신 숫자가 인증번호와 다릅니다." });
  } else {
    await tokens.updateOne({ token: token, isAuth: true });
    return res.status(200).json({ message: "인증되었습니다." });
  }
});

//유저목록 불러오기
router.get("/users", async (req, res) => {
  const user_information = await users.find({});
  return res.status(200).json({ data: user_information });
});

export default router;
