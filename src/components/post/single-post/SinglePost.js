import InputAreaField from "@/components/common/input-area-field/InputAreaField";
import GlobalDataContext from "@/components/hooks/GlobalContext";
import styles from "@/components/post/single-post/SinglePost.module.css";
import { addComment, favoriteItems } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import { getCreatedTime } from "@/lib/helper/randomGenerate";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ProfileImage from "./profile-image/ProfileImage";

const SinglePost = ({
  post,
  userId,
  callBack,
  handleRetweet,
  isProfilePage,
}) => {
  const { profile } = post;
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [retweetCaption, setRetweetCaption] = useState("");
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
    if (!userId) return;
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
      handleApiError(err);
    }
  };

  const handleUserFollow = async () => {
    if (userId == post?.userId || !userId) return;
    try {
      let response = await favoriteItems({
        criteria: isFollowed ? "UnFollow" : "Follow",
        itemId: post?.userId,
      });
      if (response.data.message == "OK") setIsFollowed(!isFollowed);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleRedirectToProfile = (id) => {
    if (!id) {
      router.push(`/profile/${post?.userId}`);
    } else {
      router.push(`/profile/${id}`);
    }
  };

  const handleRetweetContent = (e) => {
    setRetweetCaption(e.target.value);
  };

  const submitRetweetInfo = () => {
    handleRetweet({ content: retweetCaption, tweetId: post._id });
    setOpenShareModal(false);
    setRetweetCaption("");
  };

  const handleShareModal = (type) => {
    if (!userId) return;
    if (type == "open") {
      setOpenShareModal(true);
    } else if (type == "close") {
      setOpenShareModal(false);
      setRetweetCaption("");
    }
  };

  return (
    <div className={styles["post-container"]}>
      <ProfileImage
        profile={profile}
        callBack={() => handleRedirectToProfile()}
      />
      <div className={styles["content"]}>
        <div className={styles["profile-info-and-action"]}>
          <div
            className={styles["profile-info"]}
            onClick={() => handleRedirectToProfile()}
          >
            <h2>{profile?.name || profile?.email}</h2>
            {profile?.username && <p>@{profile?.username}</p>}
            <span>.</span>
            <p>{getCreatedTime(post?.createdAt)}</p>
          </div>
          {userId != post?.userId && !isProfilePage && (
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
                callBack={() =>
                  handleRedirectToProfile(post?.tweetInfo?.userId)
                }
              />
              <div className={styles["profile-info-and-action"]}>
                <div
                  className={styles["profile-info"]}
                  onClick={() =>
                    handleRedirectToProfile(post?.tweetInfo?.userId)
                  }
                >
                  <h2>
                    {post?.tweetInfo?.profile?.name ||
                      post?.tweetInfo?.profile?.email}
                  </h2>
                  {post?.tweetInfo?.profile?.username && (
                    <p>@{post?.tweetInfo?.profile?.username}</p>
                  )}
                  <span>.</span>
                  <p>{getCreatedTime(post?.tweetInfo?.createdAt)}</p>
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
            <img src="/comment.png" className={styles["comment-image"]} />
            <p className={styles["comment-count"]}>{commentCount}</p>
          </div>
          {post?.type != "retweet" && (
            <div
              className={styles["show-count"]}
              onClick={() => handleShareModal("open")}
            >
              <img src="/share-icon.svg" />
            </div>
          )}
        </div>
        <div
          className={`${styles["share-modal-container"]} ${
            openShareModal && styles["active"]
          }`}
        >
          <div
            className={`${styles["share-modal"]} ${
              openShareModal && styles["active"]
            }`}
          >
            <h2>Retweet?</h2>
            <textarea
              placeholder="try adding your caption"
              type="text"
              value={retweetCaption}
              onChange={handleRetweetContent}
            />
            <button onClick={submitRetweetInfo}>Retweet</button>
            <img
              src="/close.svg"
              className={styles["close-modal"]}
              onClick={() => handleShareModal("close")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
