import express from "express";
import middleware from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { users } from "../model/userSchema.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { name, pwd } = req.body;
  try {
    const match_password = bcrypt.compareSync(pwd, hash);
    if (match_password) {
      const accessToken = jwt.sign({ user_id: user.user_id }, "secret", {
        expiresIn: "1200s",
      });
      const refreshToken = jwt.sign({}, "secret", {
        expiresIn: "3d",
      });
      // 토큰 생성, 쿠키에 기록
      tokenObject[refreshToken] = name;
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      res.cookie("user_id", name);
    }
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
});

export default router;
