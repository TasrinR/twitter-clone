import mongoose from "mongoose";

export const commentSchema = mongoose.Schema({
  comment: {
    type: String,
  },
  userId: {
    type: String, 
    required: [, "+ user Id required in commentSchema"],
  },
});
