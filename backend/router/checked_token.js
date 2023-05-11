import coolsms from "coolsms-node-sdk";

export function checkValidationPhone(myphone) {
  if (myphone.length !== 10 && myphone.length !== 11) {
    console.log("에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요!!!");
    return false;
  } else {
    return true; // 검증 통과
  }
}

export function getToken() {
  const count = 6;
  if (count === undefined) {
    console.log("에러 발생!!! 갯수를 제대로 입력해 주세요!!!");
    return;
  } else if (count <= 0) {
    console.log("에러 발생!!! 갯수가 너무 적습니다!!!");
    return;
  } else if (count > 10) {
    console.log("에러 발생!!! 갯수가 너무 많습니다!!!");
    return;
  }

  const result = String(Math.floor(Math.random() * 10 ** count)).padStart(
    count,
    "0"
  );
  return result;
  // console.log(result);
}

export async function sendTokenToSMS(myphone, token) {
  //console.log(myphone + "번호로 인증번호" + token + "를 전송합니다!!!");
  const SMS_KEY = process.env.SMS_KEY;
  const SMS_PASSWORD = process.env.SMS_PASSWORD;
  const SMS_SENDER = process.env.SMS_SENDER;

  const mysms = coolsms.default;
  const messageService = new mysms(SMS_KEY, SMS_PASSWORD);
  const result = await messageService.sendOne({
    to: myphone,
    from: SMS_SENDER,
    text: `[***주의!!*** 보이스피싱아님!!] "종완닷컴" 안녕하세요. 고객님 요청하신 인증번호[${token}] 을(를) 입력해주세요.`,
  });
}
