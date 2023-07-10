import styles from "@/components/post/single-post/SinglePost.module.css";
import { favoriteItems } from "@/lib/constants/ApiRoutes";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import { useEffect, useState } from "react";

const SinglePost = ({ post }) => {
  const { profile } = post;
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(post?.favoriteCount || 0);

  const handleFavoritePost = async () => {
    try {
      let response = await favoriteItems({
        criteria: isFavorite ? "UnFavorite" : "Favorite",
        itemId: post._id,
      });
      console.log(response);
      if (response.data.message == "OK") {
        setIsFavorite(!isFavorite);
        setFavoriteCount(isFavorite ? favoriteCount - 1 : favoriteCount + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };


  console.log(isFavorite);

  return (
    <div className={styles["post-container"]}>
      {profile?.profilePicture ? (
        <div className={styles["profile-image-area"]}>
          <img
            src={
              profile?.profilePicture ||
              "https://images.freeimages.com/images/large-previews/abb/fall-leaves-1641772.jpg"
            }
          ></img>
        </div>
      ) : (
        <div
          className={styles["profile-image-area"]}
          style={{ backgroundColor: profile?.bgColor || "#ff0072" }}
        >
          {getFirstLetters(profile?.name || profile?.email)}
        </div>
      )}
      <div className={styles["content"]}>
        <div className={styles["profile-info-and-action"]}>
          <div className={styles["profile-info"]}>
            <h2>{profile?.name || profile?.email}</h2>
            {profile?.username && <p>@{profile?.username}</p>}
            <span>.</span>
            <p>Apr 25</p>
          </div>
          <div className={styles["action-button"]}>...</div>
        </div>
        <p className={styles["content-text"]}>{post?.content?.text}</p>
        {post?.content?.image && (
          <img src={post?.content?.image} className={styles["content-image"]} />
        )}
        <div className={styles["post-action-field"]}>
          <div className={styles["show-count"]}>
            <img
              src="/favorite.svg"
              onClick={() => handleFavoritePost()}
              className={`${isFavorite && styles["active"]}}`}
            />
            <p className={styles["favorite-count"]}>{favoriteCount}</p>
          </div>
          <div className={styles["show-count"]}>
            <img src="/comment.png" className={styles["comment-image"]} />
            <p className={styles["comment-count"]}>{post?.comments?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
