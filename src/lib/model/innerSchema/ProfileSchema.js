import * as mongoose from "mongoose";

export const profileSchema = mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  bgColor: {
    type: String,
  }
});
