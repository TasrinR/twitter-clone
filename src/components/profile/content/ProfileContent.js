import Link from "next/link";
import styles from "@/components/profile/content/ProfileContent.module.css";
import { getFirstLetters } from "@/lib/helper/randomGenerate";

const ProfileContent = ({ callBack, profileContent, totalPosts }) => {
  const profile = profileContent?.profile;
  return (
    profile && (
      <div className={styles["profile-content-area"]}>
        <div className={styles["top-section"]}>
          <img className={styles["back-button"]} src="/left-vector.svg"></img>
          <div className={styles["top-text"]}>
            <h2>{profile.name}</h2>
            <p>{totalPosts} posts</p>
          </div>
        </div>
        <div className={styles["content"]}>
          <img className={styles["cover-image"]}></img>
          <div className={styles["profile"]}>
            {profile?.profilePicture ? (
              <img
                className={styles["profile-image"]}
                src={profile?.profilePicture}
              ></img>
            ) : (
              <div
                className={styles["profile-image"]}
                style={{ backgroundColor: profile?.bgColor || "#2f63d1" }}
              >
                {getFirstLetters(profile?.name)}
              </div>
            )}
            <button
              className={styles["edit-button"]}
              onClick={() => callBack("edit")}
            >
              {" "}
              Edit Profile{" "}
            </button>
            <h2>{profile.name}</h2>
            <p>@{profile.username}</p>
            <div
              className={styles["follow-following"]}
              onClick={() => callBack("favorite")}
            >
              <p>
                <strong>{profileContent?.followingList?.length}</strong>{" "}
                following
              </p>
              <p>
                <strong>{profileContent?.followerList?.length}</strong> follower
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileContent;
