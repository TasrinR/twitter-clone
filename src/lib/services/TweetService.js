import { ObjectId } from "bson";
import Tweet from "../model/Tweet";

export const postTweet = async (req, res) => {
  const { type } = req.query;
  let tweet;
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

  return newTweet;
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
    { $push: { comments: newComment._id } }
  );
  return newComment;
};

export const getAllTweet = async (req, res) => {
  const Collection = Tweet;

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
    { $sort: { _id: -1 } },
  ]);
  return allTweets;
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
