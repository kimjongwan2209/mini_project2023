import { getToday } from "./utils.js";
import nodemailer from "nodemailer";
import "dotenv/config";

//이메일 형식 체크
export function checkEmail(email) {
  if (email === undefined || email.includes("@") === false) {
    return false;
  }
  if (email.match(/\s/g) !== null) {
    return false;
  }
}

//가입환영 플랫폼 생성
export function getWelcomeTemplate(name, email, phone, prefer) {
  const mytemplate = `
        <html>
            <body style="width:500px;">
                <h1 style="color: green">${name}님 가입을 환영합니다.</h1>
                <hr />
                <div>이메일: ${email}</div>
                <div>내가 좋아하는 사이트: ${prefer}</div>
                <div>휴대폰번호: ${phone}</div>
                <div>가입일: ${getToday()}</div>
            </body>
        </html>
    `;
  console.log(mytemplate);
  return mytemplate;
}

//플랫폼 전송
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
