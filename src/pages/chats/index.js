import MessageUser from "@/components/chat/message-user/MessageUser";
import SingleChat from "@/components/chat/single-chat/SingleChat";
import Navbar from "@/components/navbar/Navbar";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import styles from "@/components/home/HomePageSection.module.css";
import GlobalDataContext from "@/components/hooks/GlobalContext";

const index = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState();
  const { setCurrentRoom } = useContext(GlobalDataContext);

  useEffect(() => {
    if (session && !user) {
      let decodedToken = jwtDecode(session.user?.accessToken);
      setUser(decodedToken);
    }

    return () => {
      setCurrentRoom()
    }
  }, [session]);

  const handleChatRoomSlide = (roomId) => {
    setCurrentRoom(roomId);
  };

  return (
    <div className={styles["home-page-container"]}>
      <Navbar activeNav={"chats"} />
      <div className={styles["post-container"]}>
        <SingleChat
          id={user?.id}
        />
      </div>
      <MessageUser user={user} callBack={handleChatRoomSlide} />
    </div>
  );
};

export default index;
