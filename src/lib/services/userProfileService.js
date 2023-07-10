import User from "../model/User";

export const createUserBasicInfo = async (req, res) => {
  const { id } = req.user;
  const { name, username, bio, profilePicture, coverImage, websiteUrl } =
    req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      profile: { name, username, bio, profilePicture, coverImage, websiteUrl },
    },
    { new: true }
  );
  return user;
};

export const getUserInfo = async (req, res) => {
  const userId = req.query.id;
  const id = req.user?.id;

  let Collection = User;

  let user = await Collection.find({ _id: userId });

  const isFollowed = id
    ? user[0].followerList.find((follower) => follower.userId == id)
      ? true
      : false
    : false;

  const {
    _id,
    email,
    profile,
    isProfileComplete,
    followerList,
    followingList,
  } = user[0];
  
  return {
    _id,
    email,
    profile,
    isProfileComplete,
    followerList,
    followingList,
    isFollowed: isFollowed,
  };
};
