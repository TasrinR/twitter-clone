import { ObjectId } from "bson";
import Post from "../model/Post";
import Tweet from "../model/Tweet";
import User from "../model/User";

export const updateFavoriteList = async (req, res) => {
  const { id } = req.user;
  const { criteria, itemId } = req.query;
  if (id == itemId) return;
  switch (criteria) {
    case "Follow":
      return await followUser(id, itemId);
    case "Favorite":
      return await favoritePost(id, itemId);
    case "UnFollow":
      return await unFollowUser(id, itemId);
    case "UnFavorite":
      return await unFavoritePost(id, itemId);
  }
};

const followUser = async (id, itemId) => {
  const Collection = User;
  const followedUser = await Collection.findOneAndUpdate(
    { _id: itemId },
    { $push: { followerList: { userId: id } } },
    { new: true }
  );
  const currentUser = await Collection.findOneAndUpdate(
    {
      _id: id,
    },
    { $push: { followingList: { userId: itemId } } },
    { new: true }
  );
};

const favoritePost = async (id, itemId) => {
  const Collection = Tweet;
  const updatedPost = await Collection.updateOne(
    { _id: itemId },
    { $push: { favoriteBy: id } }
  );
  return updatedPost;
};

const unFollowUser = async (id, itemId) => {
  const Collection = User;
  const followedUser = await Collection.findOneAndUpdate(
    { _id: itemId },
    { $pull: { followerList: { userId: id } } },
    { new: true }
  );
  const currentUser = await Collection.findOneAndUpdate(
    {
      _id: id,
    },
    { $pull: { followingList: { userId: itemId } } },
    { new: true }
  );
};

const unFavoritePost = async (id, itemId) => {
  const Collection = Tweet;
  const updatedPost = await Collection.updateOne(
    { _id: itemId },
    { $pull: { favoriteBy: id } }
  );
  return updatedPost;
};

export const getFollowFollowingList = async (req, res) => {
  const Collection = User;
  const favoriteObject = await Collection.aggregate([
    {
      $match: { _id: new ObjectId(req.query.id) },
    },
    {
      $project: {
        followerList: 1,
        followingList: 1,
      },
    },
    {
      $unwind: {
        path: "$followerList",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "followerList.userObjectId": { $toObjectId: "$followerList.userId" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followerList.userObjectId",
        foreignField: "_id",
        as: "followerList.profileInfo",
      },
    },
    {
      $unwind: {
        path: "$followingList",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "followingList.userObjectId": { $toObjectId: "$followingList.userId" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followingList.userObjectId",
        foreignField: "_id",
        as: "followingList.profileInfo",
      },
    },
    {
      $project: {
        _id: 1,
        "followerList.userId": 1,
        "followerList.profileInfo": { $first: "$followerList.profileInfo" },
        "followerList.name": {
          $first: "$followerList.profileInfo.profile.name",
        },
        "followerList.email": { $first: "$followerList.profileInfo.email" },
        "followerList.followerList": { $first: "$followerList.profileInfo.followerList" },
        "followerList.username": {
          $first: "$followerList.profileInfo.profile.username",
        },
        "followerList.profilePicture": {
          $first: "$followerList.profileInfo.profile.profilePicture",
        },
        "followerList.bgColor": {
          $first: "$followerList.profileInfo.profile.bgColor",
        },
        "followingList.userId": 1,
        "followingList.profileInfo": { $first: "$followingList.profileInfo" },
        "followingList.name": {
          $first: "$followingList.profileInfo.profile.name",
        },
        "followingList.email": { $first: "$followingList.profileInfo.email" },
        "followingList.followerList": { $first: "$followingList.profileInfo.followerList" },
        "followingList.username": {
          $first: "$followingList.profileInfo.profile.username",
        },
        "followingList.profilePicture": {
          $first: "$followingList.profileInfo.profile.profilePicture",
        },
        "followingList.bgColor": {
          $first: "$followingList.profileInfo.profile.bgColor",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        followerList: {
          $addToSet: {
            $cond: [
              { $eq: ["$followerList.userObjectId", null] },
              "$$REMOVE",
              "$followerList",
            ],
          },
        },
        followingList: {
          $addToSet: {
            $cond: [
              { $eq: ["$followingList.userObjectId", null] },
              "$$REMOVE",
              "$followingList",
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        "followerList.userId": 1,
        "followerList.name": 1,
        "followerList.email": 1,
        "followerList.followerList": 1,
        "followerList.username": 1,
        "followerList.profilePicture": 1,
        "followerList.bgColor": 1,
        "followingList.userId": 1,
        "followingList.name": 1,
        "followingList.email": 1,
        "followingList.followerList": 1,
        "followingList.username": 1,
        "followingList.profilePicture": 1,
        "followingList.bgColor": 1,
      },
    },
  ]);

  return favoriteObject[0];
};
