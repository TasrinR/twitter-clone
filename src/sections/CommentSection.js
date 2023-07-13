import React, { useEffect, useRef } from "react";
import styles from "@/components/post/CommentSection.module.css";
import InputAreaField from "@/components/common/input-area-field/InputAreaField";
import Comment from "@/components/post/comment/Comment";

const CommentSection = ({
  user,
  loader,
  comments,
  callBack,
  handleUploadComment,
}) => {
  const commentContainerRef = useRef();

  useEffect(() => {
    commentContainerRef?.current?.scroll({
      top: commentContainerRef?.current?.scrollHeight,
    });
  }, [comments]);
  return (
    <>
      <div className={styles["back-space"]}>
        <img src="/back-arrow.svg" onClick={callBack}></img>
      </div>
      <div className={styles["show-comments"]} ref={commentContainerRef}>
        {loader && <p>loading....</p>}
        {comments?.map((comment) => (
          <Comment singleComment={comment} userId={user?.id} key={comment._id} />
        ))}
      </div>
      {user && (
        <div className={styles["input-container"]}>
          <InputAreaField user={user} callBack={handleUploadComment} />
        </div>
      )}
    </>
  );
};

export default CommentSection;
