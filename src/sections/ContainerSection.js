import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/home/HomePageSection.module.css";
import CreatePostField from "@/components/home/create-post-field/CreatePostField";
import PostShowSection from "./PostShowSection";

const ContainerSection = ({
  callBack,
  user,
  posts,
  handleNewData,
  loading,
}) => {
  const containerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentPage > 1) {
      handleNewData(currentPage);
    }
  }, [currentPage]);

  const handleInfiniteScroll = () => {
    let pageNumber = Math.ceil(posts?.length / 10) + 1;
    console.log(pageNumber);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    window.addEventListener("scrollend", handleInfiniteScroll);

    return () => {
      window.removeEventListener("scrollend", handleInfiniteScroll);
    };
  }, [containerRef, posts?.length]);
  return (
    <div className={styles["post-container"]} ref={containerRef}>
      <h1 className={styles["page-title"]}>Home</h1>
      <CreatePostField callBack={callBack} user={user} />
      <PostShowSection posts={posts} />
      {loading && <p>loading......</p>}
    </div>
  );
};

export default ContainerSection;
