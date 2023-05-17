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

export const tokens = mongoose.model("tokens", tokenSchema);
