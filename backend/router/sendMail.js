import { getToday } from "./utils.js";
import nodemailer from "nodemailer";

export function checkEmail(email) {
  if (email === undefined || email.includes("@") === false) {
    console.log("에러 발생!!! 이메일 주소를 제대로 입력해 주세요!!!");
    console.log(email);
    return false;
  } else {
    return true;
  }
}

export function getWelcomeTemplate(name, email, phone) {
  const mytemplate = `
        <html>
            <body style="width:500px;">
                <h1 style="color: green">${name}님 가입을 환영합니다.</h1>
                <hr />
                <div>이메일: ${email}</div>
                <div>휴대폰번호: ${phone}</div>
                <div>가입일: ${getToday()}</div>
            </body>
        </html>
    `;
  console.log(mytemplate);
  return mytemplate;
}

export async function sendTemplateToEmail(email, result) {
  //console.log(email + "이메일로 가입환영템플릿 " + result + "를 전송합니다.");
  const email_user = process.env.EMAIL_USER;
  const email_pass = process.env.EMAIL_PASSWORD;
  const email_sender = process.env.EMAIL_SENDER;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email_user,
      pass: email_pass,
    },
  });

  const sendToMail = await transporter.sendMail({
    from: email_sender, // 보낸사람
    to: email, // 받는사람
    subject: "회원님 가입을 축하합니다.", //메일제목
    html: result, // 메일본문
  });
  console.log(sendToMail);
}
