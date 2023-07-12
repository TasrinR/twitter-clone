import * as mongoose from "mongoose";
import User from "./User";

const tweetSchema = mongoose.Schema({
  content: {
    image: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  type: {
    type: String,
    enum: ["tweet", "comment", "retweet"],
    required: true,
  },
  favoriteBy: {
    type: [String],
    required: [true, "+ favoriteBy required in post schema"]
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweets" }],
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: "Tweets" },
});

export default mongoose.models?.Tweets ?? mongoose.model("Tweets", tweetSchema);
