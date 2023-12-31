import GlobalDataContext from "@/components/hooks/GlobalContext";
import { openChatRooms } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";
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
        handleApiError(err)
      }
    }
  };

  return (
    <div className={styles["list-wrapper"]}>
      <h2>Chats </h2>
      <input
        type="text"
        onChange={handleFindChatRoom}
        className={styles["search-box"]}
      />
      {!searchList?.length ? (
        <div className={styles["rooms"]}>
          {rooms?.map((room, index) => (
            <SingleRoomField room={room} callBack={callBack} key={index} />
          ))}
        </div>
      ) : (
        <div className={styles["rooms"]}>
          {searchList?.map((userInfo, index) => (
            <SingleRoomField
              userInfo={userInfo}
              callBack={handleOpenNewRoom}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageUser;
