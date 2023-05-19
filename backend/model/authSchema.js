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
});

export const authies = mongoose.model("authies", authSchema);
