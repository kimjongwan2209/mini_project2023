import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAuth: Boolean,
});

export default () => {
  const schmaToken = mongoose.model("token", tokenSchema);
};
