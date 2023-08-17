import React, { useContext, useEffect, useState } from "react";
import styles from "@/components/notification/NotificationSection.module.css";
import {
  getNotificationHistory,
  updateNotificationSeen,
} from "@/lib/constants/ApiRoutes";
import GlobalDataContext from "@/components/hooks/GlobalContext";
import { useRouter } from "next/router";

const NotificationSection = ({ user }) => {
  const [notificationList, setNotificationList] = useState();
  const { setNewNotification } = useContext(GlobalDataContext);
  const router = useRouter();
  useEffect(() => {
    handleFetchNotification();
    return () => {
      setNewNotification();
    };
  }, []);

  const handleFetchNotification = async () => {
    try {
      let response = await getNotificationHistory();
      response = JSON.parse(JSON.stringify(response.data.result));
      setNotificationList(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotificationSeen = async (notification) => {
    try {
      let response = await updateNotificationSeen({ id: notification._id });
      if (response.data.message == "OK") {
        if (
          notification.message.includes("comment") ||
          notification.message.includes("retweet") ||
          notification.message.includes("like")
        ) {
          router.push(`/profile/${notification.to._id}`);
        } else router.push(`/profile/${notification.itemId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles["back-section"]} onClick={() => router.back()}>
        <img src="/left-vector.svg"></img>
        <h2>Back</h2>
      </div>
      <div className={styles["notification-section"]}>
        {notificationList?.map((notification) => (
          <div
            className={`${styles["single-notification"]} ${
              styles[notification.seen && "checked"]
            }`}
            onClick={() => handleNotificationSeen(notification)}
          >
            {notification.from?.profile?.name || notification.from?.email}{" "}
            {notification.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationSection;
