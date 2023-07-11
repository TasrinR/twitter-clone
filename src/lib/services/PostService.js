import { ObjectId } from "bson";
import Post from "../model/Post";

export const createPost = async (req, res) => {
  const { id } = req.user;
  const { image, text } = req.body;
  let newPost;

  const Collection = Post;

  if (!image?.length && !text?.length) {
    res.statusCode = 400;
    throw new Error("image and text fields are required");
  }

  newPost = await Collection.create({
    content: {
      image: image,
      text: text,
    },
    userId: id,
    favoriteCount: 0,
    comments: [],
  });
  let matchId = newPost._id;

  newPost = await Collection.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$_id", matchId],
        },
      },
    },
    {
      $addFields: {
        userObjectId: { $toObjectId: "$userId" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userObjectId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        favoriteBy: 1,
        comments: 1,
        userId: 1,
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
      },
    },
  ]);

  if (newPost) {
    res.statusCode = 201;
    return newPost;
  }
};

export const getAllPosts = async (req, res) => {
  let id = req.user?.id;
  let page = req.query?.page || 1;

  const Collection = Post;

  const allPosts = await Collection.aggregate([
    {
      $addFields: {
        userObjectId: { $toObjectId: "$userId" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userObjectId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
    {
      $unwind: { path: "$comments.replies", preserveNullAndEmptyArrays: true },
    },
    {
      $addFields: {
        "comments.comment.userObjectId": {
          $toObjectId: "$comments.comment.userId",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.comment.userObjectId",
        foreignField: "_id",
        as: "comments.comment.userInfo",
      },
    },
    {
      $addFields: {
        "comments.replies.userObjectId": {
          $toObjectId: "$comments.replies.userId",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.replies.userObjectId",
        foreignField: "_id",
        as: "comments.replies.userInfo",
      },
    },
    {
      $group: {
        _id: { _id: "$_id", commentId: "$comments._id" },
        userId: { $first: "$userId" },
        content: { $first: "$content" },
        comments: { $first: "$comments" },
        favoriteBy: { $first: "$favoriteBy" },
        replies: {
          $push: {
            $cond: [
              { $eq: ["$comments.replies.userObjectId", null] },
              "$$REMOVE",
              "$comments.replies",
            ],
          },
        },
        userInfo: { $first: "$userInfo" },
      },
    },
    {
      $group: {
        _id: "$_id._id",
        userId: { $first: "$userId" },
        content: { $first: "$content" },
        favoriteBy: { $first: "$favoriteBy" },
        comments: {
          $push: {
            $cond: [
              { $eq: ["$comments.comment.userObjectId", null] },
              "$$REMOVE",
              {
                comment: "$comments.comment",
                replies: "$replies",
                userInfo: "$comments.userInfo",
              },
            ],
          },
        },
        userInfo: { $first: "$userInfo" },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        favoriteBy: 1,
        userId: 1,
        "profile.name": { $first: "$userInfo.profile.name" },
        "profile.username": { $first: "$userInfo.profile.username" },
        "profile.profilePicture": {
          $first: "$userInfo.profile.profilePicture",
        },
        "profile.bgColor": { $first: "$userInfo.profile.bgColor" },
        "profile.email": { $first: "$userInfo.email" },
        "profile.followerList": { $first: "$userInfo.followerList" },
        "comments.comment.comment": 1,
        "comments.comment.userId": 1,
        "comments.comment._id": 1,
        "comments.comment.profile.name": {
          $first: { $first: "$comments.comment.userInfo.profile.name" },
        },
        "comments.comment.profile.username": {
          $first: { $first: "$comments.comment.userInfo.profile.username" },
        },
        "comments.comment.profile.profilePicture": {
          $first: {
            $first: "$comments.comment.userInfo.profile.profilePicture",
          },
        },
        "comments.comment.profile.bgColor": {
          $first: { $first: "$comments.comment.userInfo.profile.bgColor" },
        },
        "comments.comment.profile.email": {
          $first: { $first: "$comments.comment.userInfo.email" },
        },
        "comments.comment.profile.followerList": {
          $first: { $first: "$comments.comment.userInfo.followerList" },
        },
        "comments.replies.comment": 1,
        "comments.replies.userId": 1,
        "comments.replies.profile.name": {
          $first: {
            $first: { $first: "$comments.replies.userInfo.profile.name" },
          },
        },
        "comments.replies.profile.username": {
          $first: {
            $first: { $first: "$comments.replies.userInfo.profile.username" },
          },
        },
        "comments.replies.profile.profilePicture": {
          $first: {
            $first: {
              $first: "$comments.replies.userInfo.profile.profilePicture",
            },
          },
        },
        "comments.replies.profile.bgColor": {
          $first: {
            $first: { $first: "$comments.replies.userInfo.profile.bgColor" },
          },
        },
        "comments.replies.profile.email": {
          $first: { $first: { $first: "$comments.replies.userInfo.email" } },
        },
        "comments.replies.profile.followerList": {
          $first: {
            $first: { $first: "$comments.replies.userInfo.followerList" },
          },
        },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  allPosts.map((post) => {
    const isFollowed = post.profile?.followerList?.find(
      (follower) => follower.userId == id
    )
      ? true
      : false;
    post.profile.isFollowed = isFollowed;
  });

  return allPosts.slice((page - 1) * 10, page * 10);
};

export const addComment = async (req, res) => {
  const { id } = req.user;
  const { postId, commentId } = req.query;
  const { comment } = req.body;
  let updatedPost;
  if (!commentId) {
    updatedPost = await Post.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: {
            comment: {
              comment,
              userId: id,
            },
            replies: [],
          },
        },
      },
      { new: true }
    );
  } else {
    let replyComment = { comment: comment, userId: id };
    updatedPost = await Post.findOneAndUpdate(
      {
        _id: new ObjectId(postId),
        "comments.comment._id": new ObjectId(commentId),
      },
      {
        $push: {
          "comments.$.replies": replyComment,
        },
      }
    );
  }
  return updatedPost;
};

export const getAllProfilePosts = async (req) => {
  let profileId = req.query.id;

  const allPosts = await getAllPosts(req);
  return allPosts.filter((posts) => posts.userId == profileId);
};
