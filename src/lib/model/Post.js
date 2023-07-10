import * as mongoose from "mongoose";
import { postCommentSchema } from "./innerSchema/PostCommentSchema";

const postSchema = mongoose.Schema({
  content: {
    image: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  userId: {
    type: String,
    required: [true, "+ user Id required in post schema"],
  },
  favoriteCount: {
    type: Number,
    required: [true, "+ favorite Count required in post schema"],
  },
  comments: [postCommentSchema]
});

export default mongoose.models?.Posts ?? mongoose.model("Posts", postSchema);