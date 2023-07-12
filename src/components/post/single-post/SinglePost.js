import InputAreaField from "@/components/common/input-area-field/InputAreaField";
import styles from "@/components/post/single-post/SinglePost.module.css";
import { addComment, favoriteItems } from "@/lib/constants/ApiRoutes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProfileImage from "./profile-image/ProfileImage";

const SinglePost = ({ post, userId, user, callBack, handleRetweet }) => {
  const { profile } = post;
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showCommentInputArea, setShowCommentInputArea] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let postFavorite = post?.favoriteBy?.includes(userId);
    setIsFavorite(postFavorite);
    setFavoriteCount(post?.favoriteBy?.length);
    setCommentCount(post?.comments?.length);
    let following = profile.followerList?.find(
      (follower) => follower.userId == userId
    );
    setIsFollowed(!!following);
  }, [post, userId]);

  const handleFavoritePost = async () => {
    try {
      let response = await favoriteItems({
        criteria: isFavorite ? "UnFavorite" : "Favorite",
        itemId: post._id,
      });
      if (response.data.message == "OK") {
        setIsFavorite(!isFavorite);
        setFavoriteCount(isFavorite ? favoriteCount - 1 : favoriteCount + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentInputArea = () => {
    if (userId) {
      setShowCommentInputArea(!showCommentInputArea);
    }
  };

  const handlePostComment = async (content) => {
    try {
      let response = await addComment({
        postId: post?._id,
        body: { comment: content },
      });
      response = JSON.parse(JSON.stringify(response.data.result));
      let newComment = {
        comment: {
          comment: content,
          userId: userId,
          profile: user?.profile,
        },
        replies: [],
      };
      setComments([...comments, newComment]);
      setCommentCount(commentCount + 1);
      setShowCommentInputArea(false);
      setShowComment(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserFollow = async () => {
    if (userId == post?.userId) return;
    try {
      let response = await favoriteItems({
        criteria: isFollowed ? "UnFollow" : "Follow",
        itemId: post?.userId,
      });
      if (response.data.message == "OK") setIsFollowed(!isFollowed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedirectToProfile = () => {
    router.push(`/profile/${post?.userId}`);
  };

  return (
    <div className={styles["post-container"]}>
      <ProfileImage profile={profile} callBack={handleRedirectToProfile} />
      <div className={styles["content"]}>
        <div className={styles["profile-info-and-action"]}>
          <div
            className={styles["profile-info"]}
            onClick={handleRedirectToProfile}
          >
            <h2>{profile?.name || profile?.email}</h2>
            {profile?.username && <p>@{profile?.username}</p>}
            <span>.</span>
            <p>Apr 25</p>
          </div>
          {userId != post?.userId && (
            <div className={styles["action-button"]}>
              <img
                src={isFollowed ? "/following.png" : "/follow.png"}
                onClick={handleUserFollow}
              />
            </div>
          )}
        </div>
        <p className={styles["content-text"]}>{post?.content?.text}</p>
        {post?.content?.image && (
          <img src={post?.content?.image} className={styles["content-image"]} />
        )}
        {post.type === "retweet" && (
          <div className={styles["retweet-container"]}>
            <div className={styles["retweet-profile-container"]}>
              <ProfileImage
                profile={post?.tweetInfo?.profile}
                callBack={handleRedirectToProfile}
              />
              <div className={styles["profile-info-and-action"]}>
                <div
                  className={styles["profile-info"]}
                  onClick={handleRedirectToProfile}
                >
                  <h2>
                    {post?.tweetInfo?.profile?.name ||
                      post?.tweetInfo?.profile?.email}
                  </h2>
                  {post?.tweetInfo?.profile?.username && (
                    <p>@{post?.tweetInfo?.profile?.username}</p>
                  )}
                  <span>.</span>
                  <p>Apr 25</p>
                </div>
              </div>
            </div>
            <div className={styles["retweet-content-container"]}>
              <p className={styles["content-text"]}>
                {post?.tweetInfo?.content?.text}
              </p>
              {post?.content?.image && (
                <img
                  src={post?.tweetInfo?.content?.image}
                  className={styles["content-image"]}
                />
              )}
            </div>
          </div>
        )}
        <div className={styles["post-action-field"]}>
          <div className={styles["show-count"]}>
            <img
              src={isFavorite ? "/black-favorite.svg" : "/favorite.svg"}
              onClick={() => handleFavoritePost()}
            />
            <p className={styles["favorite-count"]}>{favoriteCount}</p>
          </div>
          <div
            className={styles["show-count"]}
            onClick={() => callBack(post._id)}
          >
            <img
              src="/comment.png"
              className={styles["comment-image"]}
            />
            <p
              className={styles["comment-count"]}
            >
              {commentCount}
            </p>
          </div>
          {post?.type != "retweet" && (
            <div
              className={styles["show-count"]}
              onClick={() => handleRetweet(post._id)}
            >
              <img src="/share-icon.svg" />
            </div>
          )}
        </div>
        {showCommentInputArea && (
          <InputAreaField user={user} callBack={handlePostComment} />
        )}
      </div>
    </div>
  );
};

export default SinglePost;
