import styles from "@/components/sidebar/Sidebar.module.css";
import { signOut, useSession } from "next-auth/react";

const Sidebar = ({callBack}) => {
  const { data: session } = useSession();
  const handleLogOut = async() => {
    await signOut({callbackUrl: "/"})
  }
  return (
    <div className={styles["container"]}>
      {session ? (
        <button className={styles["sidebar-button"]} onClick={handleLogOut}>Logout</button>
      ) : (
        <>
          <button className={styles["sidebar-button"]} onClick={() => callBack("login")}>Login</button>
          <button className={styles["sidebar-button"]} onClick={() => callBack("sign-up")}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
