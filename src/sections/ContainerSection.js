import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/home/HomePageSection.module.css";
import CreatePostField from "@/components/home/create-post-field/CreatePostField";
import PostShowSection from "./PostShowSection";
import CommentSection from "./CommentSection";
import { addNewTweet, getComments } from "@/lib/constants/ApiRoutes";

const ContainerSection = ({
  callBack,
  user,
  posts,
  handleNewData,
  loading,
  handleRetweet,
}) => {
  const containerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState();
  const [loader, setLoader] = useState(false);
  const [currentTweetId, setCurrentTweetId] = useState();
  const [openCommentContainer, setOpenCommentContainer] = useState(false);

  const handleFetchComments = async (tweetId) => {
    if (!tweetId) return;
    setOpenCommentContainer(true);
    setLoader(true);
    setCurrentTweetId(tweetId);
    try {
      let response = await getComments(tweetId);
      response = JSON.parse(JSON.stringify(response?.data?.result));
      setComments(response);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };

  const handleUploadComment = async (content) => {
    try {
      let response = await addNewTweet({
        type: "comment",
        itemId: currentTweetId,
        body: {
          text: content,
          image: "",
        },
      });
      response = JSON.parse(JSON.stringify(response.data.result));
      setComments([...comments, ...response]);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelFetchComment = () => {
    setOpenCommentContainer(false);
    setCurrentTweetId();
    setComments();
  };

  useEffect(() => {
    if (currentPage > 1) {
      handleNewData(currentPage);
    }
  }, [currentPage]);

  const handleInfiniteScroll = () => {
    let pageNumber = Math.ceil(posts?.length / 10) + 1;
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
      {!openCommentContainer && 
      <>
        <h1 className={styles["page-title"]}>Home</h1>
        <CreatePostField callBack={callBack} user={user} />
        <PostShowSection
          posts={posts}
          user={user}
          handleFetchComments={handleFetchComments}
          handleRetweet={handleRetweet}
        />
        {loading && <p>loading......</p>}
      </>
}
      <div
        className={`${styles["comment-container"]} ${
          styles[openCommentContainer && "active"]
        }`}
      >
        <CommentSection
          loader={loader}
          comments={comments}
          user={user}
          callBack={cancelFetchComment}
          handleUploadComment={handleUploadComment}
        />
      </div>
    </div>
  );
};

export default ContainerSection;
