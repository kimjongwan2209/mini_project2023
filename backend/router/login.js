import express from "express";
import middleware from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { users } from "../model/userSchema.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { name, pwd } = req.body;

  const match_password = 

  try {
    const accessToken = jwt.sign({ user_id: user.user_id }, "secret", {
      expiresIn: "1200s",
    });
    const refreshToken = jwt.sign({}, "secret", {
      expiresIn: "3d",
    });
      // 토큰 생성, 쿠키에 기록
      tokenObject[refreshToken] = user_id;
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      res.cookie("user_id", user_id);
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
});

export default router;
