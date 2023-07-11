import { getFirstLetters } from "@/lib/helper/randomGenerate";
import Link from "next/link";
import styles from "./UserFollowTab.module.css";

const UserFollowTab = ({ user, callBack }) => {
  return (
    <Link className={styles["wrapper"]} href={`/profile/${user.userId}`} onClick={()=> callBack("")}>
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
    </Link>
  );
};

export default UserFollowTab;
