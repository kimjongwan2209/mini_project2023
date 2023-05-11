import mongoose from "mongoose";

const starbucksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

export const schemaStarbucks = mongoose.model("starbucks", starbucksSchema);
