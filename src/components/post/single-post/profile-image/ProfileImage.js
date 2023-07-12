import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React from "react";
import styles from "./ProfileImage.module.css";

const ProfileImage = ({ profile, callBack }) => {
  return profile?.profilePicture ? (
    <div className={styles["profile-image-area"]} onClick={callBack}>
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
      onClick={callBack}
    >
      {getFirstLetters(profile?.name || profile?.email)}
    </div>
  );
};

export default ProfileImage;
