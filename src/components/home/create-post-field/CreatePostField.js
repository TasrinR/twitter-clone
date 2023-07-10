import styles from "@/components/home/create-post-field/CreatePostField.module.css";
import { uploadTweet } from "@/lib/constants/ApiRoutes";
import {
  getFirstLetters,
  getNoProfileImageBackground,
} from "@/lib/helper/randomGenerate";
import { useEffect, useState } from "react";

const CreatePostField = ({ callBack, user }) => {
  const [postContents, setPostContents] = useState({ image: "", text: "" });

  const handleContentChange = (e) => {
    setPostContents({ ...postContents, text: e.target.value });
  };
  const handleUploadTweet = () => {
    if (postContents.image?.length || postContents.text?.length) {
      callBack(postContents);
      setPostContents({ image: "", text: ""})
    }
  };

  return (
    user && (
      <div className={styles["field-container"]}>
        {user?.profile?.profilePicture ? (
          <img
            className={styles["profile-image"]}
            src={user?.profile?.profilePicture}
          ></img>
        ) : (
          <div
            className={styles["profile-image"]}
            style={{ backgroundColor: user?.profile?.bgColor || "#ff0072" }}
          >
            {getFirstLetters(user?.profile?.name)}
          </div>
        )}
        <div className={styles["input-area"]}>
          <textarea
            className={styles["post-text"]}
            placeholder="What's Happening"
            onChange={handleContentChange}
            value={postContents.text}
          />
          <div className={styles["image-and-upload-area"]}>
            <img className={styles["image-button"]} src="/gallery.svg"></img>
            <button
              className={styles["upload-button"]}
              onClick={handleUploadTweet}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreatePostField;
