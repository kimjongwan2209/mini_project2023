import express from "express";
import middleware from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { users } from "../model/userSchema.js";
import * as bcrypt from "bcrypt";
import { authies } from "../model/authSchema.js";

const router = express.Router();

let tokenObject = {};
router.post("/login", async (req, res) => {
  const { name, pwd } = req.body;

  try {
    const hash = bcrypt.hashSync(pwd, 12);
    const match_password = bcrypt.compareSync(pwd, hash);
    const create_login_date = new Date();
    const create_expires_date = new Date().setDate(
      create_login_date.getDate() + 1
    );

    if (match_password) {
      const accessToken = jwt.sign({ name: users.name }, "secret", {
        expiresIn: "1200s",
      });
      const refreshToken = jwt.sign({}, "secret", {
        expiresIn: "1d",
      });

      users.find({ name, match_password }).then((result) => {
        if (result.length == 0) {
          return res.status(400).json({ message: "로그인에 실패하였습니다." });
        }
        authies.find({ name }).then((result) => {
          console.log(result);
          console.log(name);
          if (result.length === 0) {
            authies
              .create({
                name,
                refresh_token: refreshToken,
                login_date: create_login_date,
                expires_date: create_expires_date,
              })
              .then((result) => {
                return res.status(200).json({ message: "토큰발급완료" });
              });
          }
          if (result.length !== 0) {
            authies.updateOne({ name, refreshToken }).then((result) => {
              return res.status(200).json({ message: "로그인 되었습니다." });
            });
          }
        });
        // 토큰 생성, 쿠키에 기록
        tokenObject[refreshToken] = name;
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        res.cookie("user_id", name);
      });
    }
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
});

export default router;
