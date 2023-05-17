import coolsms from "coolsms-node-sdk";
import "dotenv/config";

export function checkValidationPhone(phone) {
  const create_user_phone = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;

  if (!create_user_phone.test(phone)) {
    return false;
  }
  if (phone.match(/\s/g) !== null) {
    return false;
  }
}

//토큰 생성
export function getToken() {
  const count = 6;
  if (count === undefined) {
    return false;
  } else if (count <= 0) {
    return false;
  } else if (count > 10) {
    return false;
  }
  const result = String(Math.floor(Math.random() * 10 ** count)).padStart(
    count,
    "0"
  );
  return result;
}

//발급된 토큰 전송
export async function sendTokenToSMS(phone, token) {
  //console.log(myphone + "번호로 인증번호" + token + "를 전송합니다!!!");
  const SMS_KEY = process.env.SMS_KEY;
  const SMS_PASSWORD = process.env.SMS_PASSWORD;
  const SMS_SENDER = process.env.SMS_SENDER;

  const mysms = coolsms.default;
  const messageService = new mysms(SMS_KEY, SMS_PASSWORD);
  const result = await messageService.sendOne({
    to: phone,
    from: SMS_SENDER,
    text: `[***주의!!*** 보이스피싱아님!!] "종완닷컴" 안녕하세요. 고객님 요청하신 인증번호[${token}] 을(를) 입력해주세요.`,
  });
  return;
}
