import GlobalDataContext from "@/components/hooks/GlobalContext";
import {
  openChatRooms,
} from "@/lib/constants/ApiRoutes";
import React, { useContext, useEffect, useState } from "react";
import SingleRoomField from "../single-room-field/SingleRoomField";
import styles from "./MessageUser.module.css";

const MessageUser = ({ callBack }) => {
  const { availableUser, rooms } = useContext(GlobalDataContext);
  const [searchList, setSearchList] = useState();

  const handleFindChatRoom = (e) => {
    if (e.target.value.length == 0) {
      setSearchList();
      return;
    }
    setSearchList(
      availableUser.filter((user) => user.email?.includes(e.target.value))
    );
  };

  const handleOpenNewRoom = async (userId) => {
    if (userId) {
      try {
        let response = await openChatRooms({ userId: userId });
        response = JSON.parse(JSON.stringify(response?.data?.result));
        callBack(response.roomId);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={styles["list-wrapper"]}>
      <h2>Chats </h2>
      <input type="text" onChange={handleFindChatRoom} />
      {!searchList?.length ? (
        <div className={styles["rooms"]}>
          {rooms?.map((room) => (
            <SingleRoomField room={room} callBack={callBack} />
          ))}
        </div>
      ) : (
        <div className={styles["rooms"]}>
          {searchList?.map((userInfo) => (
            <SingleRoomField userInfo={userInfo} callBack={handleOpenNewRoom} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageUser;
