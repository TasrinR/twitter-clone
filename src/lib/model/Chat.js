import * as mongoose from "mongoose"
import User from "./User";

const chatSchema = mongoose.Schema({
  chatField: { type: mongoose.Schema.Types.ObjectId, ref: User },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
});

export default mongoose.models?.Chats ?? mongoose.model("Chats", chatSchema);
