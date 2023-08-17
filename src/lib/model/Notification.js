import mongoose from "mongoose";
import User from "./User";

const notificationSchema = mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    message: {
      type: String,
    },
    itemId: {
      type: String,
    },
    seen: { type: Boolean },
  },
  {
    timeStamp: true,
  }
);

export default mongoose.models.Notification ??
  mongoose.model("Notification", notificationSchema);
