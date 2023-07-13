import { favoriteItems } from "@/lib/constants/ApiRoutes";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./UserFollowTab.module.css";

const UserFollowTab = ({ user, callBack, userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    let following = user?.followerList?.find(
      (follower) => follower.userId == userId
    );
    setIsFollowing(!!following);
  }, [user, userId]);

  const handleFollowUser = async () => {
    try {
      let response = await favoriteItems({
        criteria: isFollowing ? "UnFollow" : "Follow",
        itemId: user?.userId,
      });
      if (response.data.message == "OK") {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    user?.userId && (
      <div className={styles["container"]}>
        <Link
          className={styles["wrapper"]}
          href={`/profile/${user.userId}`}
          onClick={() => callBack("")}
        >
          {user?.profilePicture ? (
            <img
              className={styles["profile-image"]}
              src={user?.profilePicture}
            />
          ) : (
            <div
              className={styles["profile-image"]}
              style={{ backgroundColor: user?.bgColor }}
            >
              {getFirstLetters(user?.name || user?.email)}
            </div>
          )}
          <h2 className={styles["name"]}>{user?.name || user?.email}</h2>
        </Link>
        <button className={styles["follow-button"]} onClick={handleFollowUser}>
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    )
  );
};

export default UserFollowTab;
