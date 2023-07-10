import * as mongoose from "mongoose";
import { commentSchema } from "./CommentSchema";

export const postCommentSchema = mongoose.Schema({
  comment: commentSchema,
  replies: [commentSchema],
});
