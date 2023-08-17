import React, { useEffect, useState } from "react";
import styles from "@/components/home/HomePageSection.module.css";
import NotificationSection from "@/sections/NotificationSection";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";

const index = () => {
  const [user, setUser] = useState();
  const  {data: session} = useSession();
  useEffect(()=> {
    if (!!session && !user) {
      setUser(jwtDecode(session?.user?.accessToken));
    }
  },[session])
  return (
    <div className={styles["home=page-container"]}>
      <Navbar activeNav={"notification"} />
      <div
        className={styles["post-container"]}
      >
        <NotificationSection user={user}/>
      </div>
      <Sidebar />
    </div>
  );
};

export default index;
