import { getUserFavoriteList } from "@/lib/constants/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import UserFollowTab from "../user-follow-tab/UserFollowTab";
import styles from "./FollowArea.module.css";

const FollowArea = ({ callBack, userId }) => {
  const [list, setList] = useState();
  const [activeId, setActiveId] = useState(1);
  const wrapperRef = useRef();
  const tabItems = [
    {
      tabName: "Following",
      id: 1,
    },
    {
      tabName: "Follower",
      id: 2,
    },
  ];

  const handleTabItem = (id) => {
    if (id == activeId) return;
    setActiveId(id);
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    if (userId) {
      if (!!list) return;
      handleFavoriteList();
    }
  }, [userId]);

  const handleClickOutside = (e) => {
    e.stopPropagation();
    if (e.target === wrapperRef?.current) {
      callBack("");
    }
  };

  const handleFavoriteList = async () => {
    try {
      const res = await getUserFavoriteList({ userId: userId });
      let response = JSON.parse(JSON.stringify(res.data.result));
      setList(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles["container"]} ref={wrapperRef}>
      <div className={styles["field-area"]}>
        <div className={styles["tab-wrapper"]}>
          {tabItems.map((item) => (
            <p
              className={`${styles["tab-item"]} ${
                item.id == activeId && styles["active"]
              }`}
              onClick={() => handleTabItem(item.id)}
            >
              {item.tabName}
            </p>
          ))}
        </div>
        <div className={styles["show-list-area"]}>
          {activeId == 1
            ? list?.followingList?.map((item, index) => (
                <UserFollowTab user={item} callBack={callBack} key={index} />
              ))
            : list?.followerList?.map((item, index) => (
                <UserFollowTab user={item} callBack={callBack} key={index} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default FollowArea;
