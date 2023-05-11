import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  personal: {
    type: String,
    required: true,
  },
  prefer: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

export default () => {
  const schemaUser = mongoose.model("users", usersSchema);
};
