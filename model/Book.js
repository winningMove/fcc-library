const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
});

module.exports = model("Book", bookSchema);
