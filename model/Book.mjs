import { model, Schema } from "mongoose";

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
});

export default model("Book", bookSchema);
