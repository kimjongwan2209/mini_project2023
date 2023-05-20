import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  login_date: {
    type: Date,
    required: true,
  },
  expires_date: {
    type: Date,
    required: true,
  },
});

export const auths = mongoose.model("authies", authSchema);
