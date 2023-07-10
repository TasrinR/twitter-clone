import { getFirstLetters } from "@/lib/helper/randomGenerate";
import styles from "./UserFollowTab.module.css";

const UserFollowTab = ({ user }) => {
  return (
    <div className={styles["wrapper"]}>
      {user?.profilePicture ? (
        <img className={styles["profile-image"]} src={user?.profilePicture} />
      ) : (
        <div
          className={styles["profile-image"]}
          style={{ backgroundColor: user?.bgColor }}
        >
          {getFirstLetters(user?.name || user?.email)}
        </div>
      )}
      <h2 className={styles["name"]}>{user?.name || user?.email}</h2>
    </div>
  );
};

export default UserFollowTab;