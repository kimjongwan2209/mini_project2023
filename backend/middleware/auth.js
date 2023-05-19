import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { users } from "../model/userSchema.js";
import { authies } from "../model/authSchema.js";

export default (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  try {
    const myToken = verifyToken(authToken);
    if (myToken == "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(authToken, "secret");
      const name = userInfo.name;
      let refresh_token;
      authies.find({ name }).then((u) => {
        // refresh 토큰을 가지고 오는 코드
        refresh_token = u.refresh_token;
        const myRefreshToken = verifyToken(refresh_token);
        if (myRefreshToken == "jwt expired") {
          res.status(400).send({ errorMessage: "로그인이 필요합니다." });
        } else {
          const myNewToken = jwt.sign({ name: u.user_id }, "secret", {
            expiresIn: "1200s",
          });
          res.send({ message: "new token", myNewToken });
        }
      });
    } else {
      const { name } = jwt.verify(authToken, "secret");
      authies.find({ name }).then((u) => {
        res.locals.user = u;
        next();
      });
    }
  } catch (err) {
    res.status(401).send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, "secret");
  } catch (error) {
    return error.message;
  }
}
