const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
  return { type: Schema.Types.ObjectId, ref: name };
}

const CommentSchema = new Schema({
  date: Date,
  user: ref("User"),
  movie: ref("Movie"),
  parent: ref("Comment"),
  text: String,
});

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
