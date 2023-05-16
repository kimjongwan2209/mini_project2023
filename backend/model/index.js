import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const connect = async () => {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/miniproject")
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

export default connect;
