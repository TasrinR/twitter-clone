import GlobalDataContext from "@/components/hooks/GlobalContext";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useContext } from "react";
import styles from "./SingleRoomField.module.css";

const SingleRoomField = ({ room, userInfo, callBack }) => {
  const { newMessageNotification, currentRoom } = useContext(GlobalDataContext);
  let { roomInfo } = room || {};
  return (
    <div
      className={`${styles["single-field"]} ${
        styles[currentRoom == room?.roomId && "active"]
      }`}
      onClick={() => callBack(room?.roomId || userInfo.userId)}
    >
      {room?.roomId == newMessageNotification && newMessageNotification != undefined && (
        <span className={styles["notification-badge"]}></span>
      )}
      <div
        className={styles["picture"]}
        style={{
          backgroundColor: roomInfo?.profile?.bgColor || userInfo?.bgColor,
        }}
      >
        {roomInfo?.profile?.profilePicture || userInfo?.profilePicture ? (
          <img
            src={roomInfo?.profile?.profilePicture || userInfo?.profilePicture}
          />
        ) : (
          <p>
            {getFirstLetters(
              roomInfo?.profile?.name ||
                userInfo?.name ||
                userInfo?.email ||
                roomInfo?.email
            )}
          </p>
        )}
      </div>
      <h3>
        {roomInfo?.profile?.name ||
          userInfo?.name ||
          userInfo?.email ||
          roomInfo?.email}
      </h3>
    </div>
  );
};

export default SingleRoomField;
