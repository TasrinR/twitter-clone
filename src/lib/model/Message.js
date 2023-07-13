import mongoose from "mongoose";
import Chat from "./Chat";
import User from "./User";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: User },
    content: {
      type: String,
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Chat,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Messages ??
  mongoose.model("Messages", messageSchema);
