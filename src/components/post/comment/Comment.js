import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useState } from "react";
import styles from "./Comment.module.css";

const Comment = ({ singleComment }) => {
  let { comment } = singleComment || {};
  let { profile } = comment || {};
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [showReplies, setShowReplies] = useState(false);

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };
  return (
    <div className={styles["comment-container"]}>
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
        <p>{comment?.comment}</p>
        {replyCount ? (
          <span
            className={styles["view-reply-button"]}
            onClick={handleShowReplies}
          >
            {showReplies ? "Hide Replies" : `View Replies ${replyCount}`}
          </span>
        ) : (
          <span className={styles["reply"]}>Reply</span>
        )}
      </div>
    </div>
  );
};

export default Comment;
