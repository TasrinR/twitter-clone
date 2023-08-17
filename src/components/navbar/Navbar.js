import React, { useContext, useEffect, useState } from "react";
import styles from "@/components/navbar/Navbar.module.css";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import {
  getFirstLetters,
  getNoProfileImageBackground,
  getRandomColor,
} from "@/lib/helper/randomGenerate";
import GlobalDataContext from "../hooks/GlobalContext";

const Navbar = ({ activeNav }) => {
  const [user, setUser] = useState();
  const { data: session } = useSession();
  const { newMessageNotification, newNotification } = useContext(GlobalDataContext);
  useEffect(() => {
    if (!!session && !user) {
      setUser(jwtDecode(session?.user?.accessToken));
    }
  }, [session, newMessageNotification]);

  return (
    <div className={styles["container"]}>
      <div className={styles["nav-items"]}>
        <Link href={"/"}>
          <nav
            className={`${styles["item"]} ${
              activeNav === "home" && styles["active"]
            }`}
          >
            <img src="/home.svg" className={styles["item-image"]}></img>
            <span>Home</span>
          </nav>
        </Link>
        {!!session && (
          <>
            <Link href={`/profile/${user?.id}`}>
              <nav
                className={`${styles["item"]} ${
                  activeNav === "profile" && styles["active"]
                }`}
              >
                <img src="/user.png" className={styles["item-image"]}></img>
                <span>Profile</span>
              </nav>
            </Link>
            <Link href={`/chats`}>
              <nav
                className={`${styles["item"]} ${
                  activeNav === "chats" && styles["active"]
                }`}
              >
                <img src="/chat.svg" className={styles["item-image"]}></img>
                <span>Chats</span>
                {newMessageNotification ? (
                  <span className={styles["new-notification"]}></span>
                ) : (
                  ""
                )}
              </nav>
            </Link>
            <Link href={`/notification`}>
              <nav
                className={`${styles["item"]} ${
                  activeNav === "notification" && styles["active"]
                }`}
              >
                <img src="/bell-icon.svg" className={styles["item-image"]}></img>
                <span>Notification</span>
                {newNotification ? (
                  <span className={styles["new-notification"]}></span>
                ) : (
                  ""
                )}
              </nav>
            </Link>
          </>
        )}
      </div>
      {!!session && (
        <Link href={`/profile/${user?.id}`}>
          <div className={styles["profile-section"]}>
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
            <div className={styles["profile-info"]}>
              <h2>{user?.profile?.name}</h2>
              <h4>{user?.profile?.userName}</h4>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
