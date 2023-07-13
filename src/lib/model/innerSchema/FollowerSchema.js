import mongoose from "mongoose";

export const followerSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
});
