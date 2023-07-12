import InputAreaField from "@/components/common/input-area-field/InputAreaField";
import { addReply, favoriteItems } from "@/lib/constants/ApiRoutes";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useEffect, useState } from "react";
import Reply from "../reply/Reply";
import styles from "./Comment.module.css";

const Comment = ({ singleComment, user, userId }) => {
  let { profile, favoriteBy } = singleComment || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    let following = favoriteBy?.includes(userId);
    setIsFavorite(!!following);
    setFavoriteCount(favoriteBy?.length);
  }, [singleComment]);

  const handleFavoriteComment = async () => {
    try {
      let response = await favoriteItems({
        criteria: isFavorite ? "UnFavorite" : "Favorite",
        itemId: singleComment._id,
      });
      if (response.data.message == "OK") {
        setIsFavorite(!isFavorite);
        setFavoriteCount(isFavorite ? favoriteCount - 1 : favoriteCount + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles["comment-container"]}>
      <div className={styles["show-comment-contents"]}>
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
          <h4>{profile?.name || profile?.email}</h4>
          <p>{singleComment.content.text}</p>
          <div className={styles["favorite-area"]}>
            <img
              src={isFavorite ? "/black-favorite.svg" : "favorite.svg"}
              onClick={handleFavoriteComment}
            />
            <p>{favoriteCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
