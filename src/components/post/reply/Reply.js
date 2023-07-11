import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React from "react";
import styles from "./Reply.module.css";

const Reply = ({ replyComment }) => {
  const { profile } = replyComment;
  return (
    <div className={styles["reply-box-container"]}>
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
        <p>{replyComment?.comment}</p>
      </div>
    </div>
  );
};

export default Reply;
