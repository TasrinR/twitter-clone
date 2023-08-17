import Message from "../model/Message";

export const PostMessage = async (req, res) => {
  let senderId = req.user?.id;

  let newChat = await Message.create({
    sender: senderId,
    content: req.body.message,
    chatId: req.body.roomId,
  });

  let newChatId = newChat._id;
  newChat = Message.findOne({ _id: newChatId }).populate(
    "sender",
    "profile.name profile.profilePicture profile.bgColor"
  );
  
  return newChat;
};

export const FetchRoomMessages = async (req, res) => {
  let { roomId } = req.query;
  let messages = Message.find({ chatId: roomId }).populate(
    "sender",
    "profile.name profile.profilePicture profile.bgColor"
  );
  return messages;
};
