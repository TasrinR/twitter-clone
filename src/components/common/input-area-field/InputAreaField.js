import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useState } from "react";
import styles from "./InputAreaField.module.css";

const InputAreaField = ({ user, callBack }) => {
  const [commentContent, setCommentContent] = useState("");
  const handleContentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleSendComment = () => {
    callBack(commentContent);
    setCommentContent("")
  } 
  return (
    <div className={styles["input-area-container"]}>
      {user?.profile?.profilePicture ? (
        <div
          className={`${styles["profile-image-area"]} ${styles["comment-box"]}`}
        >
          <img
            src={
              user?.profile?.profilePicture ||
              "https://images.freeimages.com/images/large-previews/abb/fall-leaves-1641772.jpg"
            }
          ></img>
        </div>
      ) : (
        <div
          className={`${styles["profile-image-area"]} ${styles["comment-box"]}`}
          style={{ backgroundColor: user?.profile?.bgColor || "#ff0072" }}
        >
          {getFirstLetters(user?.profile?.name || user?.profile?.email)}
        </div>
      )}
      <input
        type="text"
        className={styles["comment-input"]}
        onChange={handleContentChange}
        value={commentContent}
      />
      <img
        src="/send-button.png"
        className={styles["send-button"]}
        onClick={handleSendComment}
      />
    </div>
  );
};

export default InputAreaField;
