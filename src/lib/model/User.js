import mongoose from "mongoose";
import { followerSchema } from "./innerSchema/FollowerSchema";
import { followingSchema } from "./innerSchema/FollowingSchema";
import { profileSchema } from "./innerSchema/ProfileSchema";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: profileSchema,
  isProfileComplete: {
    type: Boolean,
  },
  followerList: [followerSchema],
  followingList: [followingSchema],
});

export default mongoose.models?.Users ?? mongoose.model("Users", userSchema);
