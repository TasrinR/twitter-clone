import Chat from "../model/Chat";

export const OpenChat = async (req, res) => {
  const { id } = req.user;
  const { userId } = req.body;
  let chat;

  const isChatExist = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (!isChatExist.length) {
    let newChat = await Chat.create({
      chatField: userId,
      users: [id, userId],
    });
    if (newChat) {
      res.statusCode = 201;
      chat = newChat;
    }
  } else {
    chat = isChatExist[0];
  }

  chat = await Chat.findOne({ _id: chat._id })
    .populate(
      "chatField",
      "profile.name profile.profilePicture profile.email profile.bgColor"
    )
    .populate(
      "users",
      "profile.name profile.profilePicture profile.email profile.bgColor"
    );

  let chatObject = {
    roomId: chat._id,
    roomName: chat.chatField?.profile?.name,
    roomProfilePicture: chat.chatField?.profile?.profilePicture,
    roomBackground: chat.chatField?.profile?.bgColor,
    roomEmail: chat.chatField?.profile?.email,
    users: chat.users,
  };

  return chatObject;
};

export const getUserChatRooms = async (req, res) => {
  const userId = req.user?.id;
  let messageList = await Chat.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate(
      "users",
      "profile.name profile.profilePicture profile.bgColor email"
    )
    .select("_id users");

  let roomList = messageList.map((item) => {
    return {
      roomId: item._id,
      roomInfo: item.users.find((elem) => elem._id != userId),
    };
  });

  return roomList;
};
