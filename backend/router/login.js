import express from "express";
import user from "../model/userSchema.js";
import {
  checkValidationPhone,
  getToken,
  sendTokenToSMS,
} from "./checked_token.js";
import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "./sendMail.js";
import schmaToken from "../model/tokenSchema.js";
const router = express.Router();

router.post("/token/phone", async (req, res) => {
  const { phone } = req.body;
  // 1. 휴대폰번호 자릿수 맞는지 확인하기
  const isValidPhone = checkValidationPhone(phone);
  if (isValidPhone) {
    // 2. 핸드폰 토큰 6자리 만들기
    const mytoken = getToken();
    // 3. 핸드폰번호에 토큰 전송하기
    sendTokenToSMS(phone, mytoken);
    res.send("전송을 완료하였습니다.");
    await schmaToken.create({ phone, mytoken });
  }
});

router.post("/checkedToken", async (req, res) => {
  const { token, phone } = req.body;
  // 1. 핸드폰 번호와 토큰이 맞는지 검증
  const findNumbers = await Token.find({ phone: phone, token: token });
  //2. 만약 2개가 일치 한다면 isAuth를 ture로 업데이트
  if (findNumbers.phone && findNumbers.token) {
    schmaToken.isAuth.updateOne(
      { phone: phone, token: token },
      { isAuth: "True" }
    );
  } else {
    //에러처리 값이 없을경우
  }
});

router.post("/user", async (req, res) => {
  const { name, email, personal, prefer, pwd, phone } = req.body;

  const findToken = await token.find({ phone: phone });
  if (findToken.isAuth === false) {
    return res.status(422).json({
      message: "핸드폰 번호가 인증되지 않습니다.",
    });
  } else {
    // 1. 휴대폰번호 자릿수 맞는지 확인하기
    const isValidPhone = checkValidationPhone(phone);
    if (isValidPhone) {
      // 2. 핸드폰 토큰 6자리 만들기
      const mytoken = getToken();
      // 3. 핸드폰번호에 토큰 전송하기
      sendTokenToSMS(myphone, mytoken);
      res.send("인증완료!!!");
    }

    const isValidEmail = checkEmail(email);
    if (isValidEmail) {
      // 2. 가입환영 템플릿 만들기
      const mytemplate = getWelcomeTemplate(name, email, phone, site);
      sendTemplateToEmail(email, mytemplate);
      res.send("가입완료!!!");
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
    console.log(parts[0] + "-" + masked);
  }

  await user.create({ name, email, masked, prefer, pwd, phone });
  //스크래핑

  return res.status(200).json({});
});

router.get("/users", async (req, res) => {
  const user_information = await user.find({ _id: _id });
});

export default { router };
