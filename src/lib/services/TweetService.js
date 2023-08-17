import { ObjectId } from "bson";
import Tweet from "../model/Tweet";
import Notification from "../model/Notification";

export const postTweet = async (req, res) => {
  const { type } = req.query;
  switch (type) {
    case "comment":
      return await postTweetComment(req, res);
    case "retweet":
      return await retweet(req, res);
    default:
      return await postNewTweet(req, res);
  }
};

export const postNewTweet = async (req, res) => {
  const { id } = req.user;
  const { image, text } = req.body;

  if (!image.length && !text.length) {
    res.statusCode = 400;
    throw new Error("image and text fields are required");
  }

  const Collection = Tweet;
  let newTweet = await Collection.create({
    content: {
      image: image,
      text: text,
    },
    userId: id,
    type: "tweet",
    comments: [],
    favoriteBy: [],
  });
  let matchId = newTweet._id;

  newTweet = await Collection.aggregate([
    {
      $match: {
        _id: matchId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
      },
    },
  ]);

  return newTweet;
};

export const retweet = async (req, res) => {
  const { id } = req.user;
  const { itemId } = req.query;
  const { image, text } = req.body;
  let newTweet = await Tweet.create({
    content: {
      image: image,
      text: text,
    },
    type: "retweet",
    comments: [],
    userId: id,
    tweetId: itemId,
    favoriteBy: [],
  });
  const post = await Tweet.findById(itemId);
  let newNotification = await Notification.create({
    to: post.userId,
    from: id,
    message: `retweeted your tweet`,
    itemId: itemId,
    seen: false,
  });

  newNotification = await Notification.findOne({ _id: newNotification._id })
    .populate("to", "profile.name profile.profilePicture email profile.bgColor")
    .populate(
      "from",
      "profile.name profile.profilePicture email profile.bgColor"
    );

  let matchId = newTweet._id;

  newTweet = await Tweet.aggregate([
    {
      $match: {
        _id: matchId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweetId",
        foreignField: "_id",
        as: "tweetInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        tweetId: {
          $cond: [{ $eq: ["$tweetId", null] }, "$$REMOVE", "$tweetId"],
        },
        tweetInfo: {
          $cond: [
            { $eq: [{ $size: "$tweetInfo" }, 0] },
            "$$REMOVE",
            { $first: "$tweetInfo" },
          ],
        },
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
        comments: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tweetInfo.userId",
        foreignField: "_id",
        as: "tweetInfo.userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        profile: 1,
        comments: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "tweetInfo.content": 1,
        "tweetInfo.userId": 1,
        "tweetInfo.type": 1,
        "tweetInfo.comments": 1,
        "tweetInfo.favoriteBy": 1,
        "tweetInfo.profile.name": {
          $first: "$tweetInfo.userInfo.profile.name",
        },
        "tweetInfo.profile.username": {
          $first: "$tweetInfo.userInfo.profile.username",
        },
        "tweetInfo.profile.profilePicture": {
          $first: "$tweetInfo.userInfo.profile.profilePicture",
        },
        "tweetInfo.profile.bgColor": {
          $first: "$tweetInfo.userInfo.profile.bgColor",
        },
        "tweetInfo.profile.email": {
          $first: "$tweetInfo.userInfo.email",
        },
        "tweetInfo.profile.followerList": {
          $first: "$tweetInfo.userInfo.followerList",
        },
      },
    },
  ]);

  return { newTweet: newTweet[0], newNotification };
};

export const postTweetComment = async (req, res) => {
  const { id } = req.user;
  const { itemId } = req.query;
  const { image, text } = req.body;

  if (!image.length && !text.length) {
    res.statusCode = 400;
    throw new Error("image and text fields are required");
  }
  const Collection = Tweet;
  let newComment = await Collection.create({
    content: {
      image: image,
      text: text,
    },
    userId: id,
    type: "comment",
    tweetId: itemId,
    favoriteBy: [],
  });
  const post = await Collection.findById(itemId);
  let newNotification = await Notification.create({
    to: post.userId,
    from: id,
    message: `commented on your tweet`,
    itemId: itemId,
    seen: false,
  });

  newNotification = await Notification.findOne({ _id: newNotification._id })
    .populate("to", "profile.name profile.profilePicture email profile.bgColor")
    .populate(
      "from",
      "profile.name profile.profilePicture email profile.bgColor"
    );

  let matchId = newComment._id;
  newComment = await Collection.aggregate([
    {
      $match: {
        _id: newComment._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
      },
    },
  ]);

  await Collection.findOneAndUpdate(
    { _id: itemId },
    { $push: { comments: matchId } }
  );
  return { newComment: newComment[0], newNotification: newNotification };
};

export const getAllTweet = async (req, res) => {
  const Collection = Tweet;
  let page = req.query?.page || 1;

  let allTweets = await Collection.aggregate([
    {
      $match: {
        $expr: {
          $or: [{ $eq: ["$type", "tweet"] }, { $eq: ["$type", "retweet"] }],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweetId",
        foreignField: "_id",
        as: "tweetInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        tweetId: {
          $cond: [{ $eq: ["$tweetId", null] }, "$$REMOVE", "$tweetId"],
        },
        tweetInfo: {
          $cond: [
            { $eq: [{ $size: "$tweetInfo" }, 0] },
            "$$REMOVE",
            { $first: "$tweetInfo" },
          ],
        },
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
        comments: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tweetInfo.userId",
        foreignField: "_id",
        as: "tweetInfo.userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        profile: 1,
        comments: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "tweetInfo.content": 1,
        "tweetInfo.userId": 1,
        "tweetInfo.type": 1,
        "tweetInfo.comments": 1,
        "tweetInfo.favoriteBy": 1,
        "tweetInfo.favoriteBy": 1,
        "tweetInfo.createdAt": 1,
        "tweetInfo.profile.name": {
          $first: "$tweetInfo.userInfo.profile.name",
        },
        "tweetInfo.profile.username": {
          $first: "$tweetInfo.userInfo.profile.username",
        },
        "tweetInfo.profile.profilePicture": {
          $first: "$tweetInfo.userInfo.profile.profilePicture",
        },
        "tweetInfo.profile.bgColor": {
          $first: "$tweetInfo.userInfo.profile.bgColor",
        },
        "tweetInfo.profile.email": {
          $first: "$tweetInfo.userInfo.email",
        },
        "tweetInfo.profile.followerList": {
          $first: "$tweetInfo.userInfo.followerList",
        },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  return allTweets.slice((page - 1) * 10, page * 10);
};

export const getAllProfileTweets = async (req, res) => {
  let profileId = req.query?.id;
  let page = req.query?.page || 1;
  let Collection = Tweet;
  let allTweets = await Collection.aggregate([
    {
      $match: { userId: new ObjectId(profileId) },
    },
    {
      $match: {
        $expr: {
          $or: [{ $eq: ["$type", "tweet"] }, { $eq: ["$type", "retweet"] }],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweetId",
        foreignField: "_id",
        as: "tweetInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        tweetId: {
          $cond: [{ $eq: ["$tweetId", null] }, "$$REMOVE", "$tweetId"],
        },
        tweetInfo: {
          $cond: [
            { $eq: [{ $size: "$tweetInfo" }, 0] },
            "$$REMOVE",
            { $first: "$tweetInfo" },
          ],
        },
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
        comments: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tweetInfo.userId",
        foreignField: "_id",
        as: "tweetInfo.userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        profile: 1,
        comments: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "tweetInfo.content": 1,
        "tweetInfo.userId": 1,
        "tweetInfo.type": 1,
        "tweetInfo.comments": 1,
        "tweetInfo.favoriteBy": 1,
        "tweetInfo.createdAt": 1,
        "tweetInfo.updatedAt": 1,
        "tweetInfo.profile.name": {
          $first: "$tweetInfo.userInfo.profile.name",
        },
        "tweetInfo.profile.username": {
          $first: "$tweetInfo.userInfo.profile.username",
        },
        "tweetInfo.profile.profilePicture": {
          $first: "$tweetInfo.userInfo.profile.profilePicture",
        },
        "tweetInfo.profile.bgColor": {
          $first: "$tweetInfo.userInfo.profile.bgColor",
        },
        "tweetInfo.profile.email": {
          $first: "$tweetInfo.userInfo.email",
        },
        "tweetInfo.profile.followerList": {
          $first: "$tweetInfo.userInfo.followerList",
        },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  return allTweets.slice((page - 1) * 10, page * 10);
};

export const getComments = async (req, res) => {
  const { tweetId } = req.query;
  let comments = await Tweet.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$type", "comment"] },
            { $eq: ["$tweetId", new ObjectId(tweetId)] },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        userId: 1,
        type: 1,
        tweetId: 1,
        favoriteBy: 1,
        createdAt: 1,
        updatedAt: 1,
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
      },
    },
  ]);
  return comments;
};
