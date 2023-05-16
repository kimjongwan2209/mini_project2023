import express from "express";
import mainRouter from "./backend/router/index.js";
import connect from "./backend/model/index.js";
import cors from "cors";

const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use("/", [mainRouter]);

// Backend API 서버 오픈
app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
