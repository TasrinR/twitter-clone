import GlobalDataContext from "@/components/hooks/GlobalContext";
import { favoriteItems } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Comment.module.css";
import { toast } from "react-toastify";

const Comment = ({ singleComment, user, userId }) => {
  let { profile, favoriteBy } = singleComment || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { socket, newNotification } = useContext(GlobalDataContext);

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
        let notification = response.data.result.newNotification;
        socket.emit("send-notification", {
          notification,
          roomNo: notification.to._id,
        });
      }
    } catch (err) {
      handleApiError(err);
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
              src={isFavorite ? "/black-favorite.svg" : "/favorite.svg"}
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
