import Link from "next/link";
import styles from "@/components/profile/content/ProfileContent.module.css";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { favoriteItems } from "@/lib/constants/ApiRoutes";

const ProfileContent = ({
  callBack,
  profileContent,
  totalPosts,
  userProfile,
}) => {
  const profile = profileContent?.profile;
  const [isFollowed, setIsFollowed] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let following = profileContent?.followerList?.find(
      (follower) => follower.userId == userProfile?.id
    );
    setIsFollowed(!!following);
  }, [profileContent, userProfile]);

  const handleUserFollow = async () => {
    if (!userProfile?.id) return;
    try {
      let response = await favoriteItems({
        criteria: isFollowed ? "UnFollow" : "Follow",
        itemId: profileContent?._id,
      });
      if (response.data.message == "OK") setIsFollowed(!isFollowed);
    } catch (err) {
      handleApiError(err);
    }
  };

  const goBack = () => {
    router.back();
  };
  return (
    <div className={styles["profile-content-area"]}>
      <div className={styles["top-section"]}>
        <img
          className={styles["back-button"]}
          src="/left-vector.svg"
          onClick={goBack}
        ></img>
        <div className={styles["top-text"]}>
          <h2>{profile?.name || profileContent?.email}</h2>
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
              {getFirstLetters(profile?.name || profileContent?.email)}
            </div>
          )}
          {profileContent._id == userProfile?.id ? (
            <button
              className={styles["edit-button"]}
              onClick={() => callBack("edit")}
            >
              Edit Profile
            </button>
          ) : (
            <img
              src={isFollowed ? "/following.png" : "/follow.png"}
              className={styles["follow-button"]}
              onClick={handleUserFollow}
            />
          )}
          <h2>{profile?.name || profileContent?.email}</h2>
          <p>@{profile?.username || "no username"}</p>
          <div
            className={styles["follow-following"]}
            onClick={() => callBack("favorite")}
          >
            <p>
              <strong>{profileContent?.followingList?.length}</strong> following
            </p>
            <p>
              <strong>{profileContent?.followerList?.length}</strong> follower
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
