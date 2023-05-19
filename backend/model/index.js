import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", true);

const connect = async () => {
  const database_adress = process.env.DATABASE_ADDRESS;
  await mongoose.connect(database_adress).catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

export default connect;
