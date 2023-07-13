import mongoose from "mongoose";

export const followingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
});