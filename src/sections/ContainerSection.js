import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/home/HomePageSection.module.css";
import CreatePostField from "@/components/home/create-post-field/CreatePostField";
import PostShowSection from "./PostShowSection";
import CommentSection from "./CommentSection";
import { addNewTweet, getComments } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";

const ContainerSection = ({
  callBack,
  user,
  posts,
  handleNewData,
  loading,
  handleRetweet,
  isProfilePage,
  tweetMessage,
}) => {
  const containerRef = useRef();
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
      handleApiError(err);
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
      handleApiError(err);
    }
  };

  const cancelFetchComment = () => {
    setOpenCommentContainer(false);
    setCurrentTweetId();
    setComments();
  };

  const handleInfiniteScroll = () => {
    let pageNumber = Math.ceil(posts?.length / 10) + 1;
    handleNewData(pageNumber);
  };

  useEffect(() => {
    window.addEventListener("scrollend", handleInfiniteScroll);

    return () => {
      window.removeEventListener("scrollend", handleInfiniteScroll);
    };
  }, [containerRef, posts?.length]);
  return (
    <div
      className={`${styles["post-container"]} ${
        isProfilePage && styles["profile"]
      }`}
      ref={containerRef}
    >
      {!openCommentContainer && (
        <>
          {!isProfilePage && <h1 className={styles["page-title"]}>Home</h1>}
          {!isProfilePage && (
            <CreatePostField callBack={callBack} user={user} />
          )}
          <PostShowSection
            posts={posts}
            user={user}
            handleFetchComments={handleFetchComments}
            handleRetweet={handleRetweet}
            isProfilePage={isProfilePage}
          />
          {loading && <p>loading......</p>}
          {tweetMessage && !loading && (
            <div className={styles["message-container"]}>
              <p>{tweetMessage}</p>
              <img src="/check-mark.svg" />
            </div>
          )}
        </>
      )}
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
