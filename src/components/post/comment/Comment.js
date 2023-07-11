import InputAreaField from "@/components/common/input-area-field/InputAreaField";
import { addReply } from "@/lib/constants/ApiRoutes";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useEffect, useState } from "react";
import Reply from "../reply/Reply";
import styles from "./Comment.module.css";

const Comment = ({ singleComment, user, postId, userId }) => {
  let { comment } = singleComment || {};
  let { profile } = comment || {};
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [showReplies, setShowReplies] = useState(false);
  const [openReplyBox, setOpenReplyBox] = useState(false);

  useEffect(() => {
    setReplies(singleComment?.replies);
    setReplyCount(singleComment?.replies?.length);
  }, [singleComment]);

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleUploadReply = async (content) => {
    try {
      let response = await addReply({
        postId: postId,
        commentId: comment._id,
        body: { comment: content },
      });
      response = JSON.parse(JSON.stringify(response.data.result));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles["comment-container"]}>
      <div className={styles["show-comment-contents"]}>
        {profile?.profilePicture ? (
          <div className={styles["profile-image-area"]}>
            <img
              src={
                profile?.profilePicture ||
                "https://images.freeimages.com/images/large-previews/abb/fall-leaves-1641772.jpg"
              }
            ></img>
          </div>
        ) : (
          <div
            className={styles["profile-image-area"]}
            style={{ backgroundColor: profile?.bgColor || "#ff0072" }}
          >
            {getFirstLetters(profile?.name || profile?.email)}
          </div>
        )}
        <div className={styles["content"]}>
          <h4>{profile?.name || profile?.email}</h4>
          <p>{comment?.comment}</p>
          {replyCount ? (
            <span
              className={styles["view-reply-button"]}
              onClick={handleShowReplies}
            >
              {showReplies ? "Hide Replies" : `View Replies (${replyCount})`}
            </span>
          ) : (
            ""
          )}
          <span
            className={styles["reply"]}
            onClick={() => setOpenReplyBox(!openReplyBox)}
          >
            Reply
          </span>
        </div>
      </div>
      {openReplyBox && (
        <div className={styles["reply-box-container"]}>
          <InputAreaField user={user} callBack={handleUploadReply} />
        </div>
      )}

      {showReplies && replies.map((reply) => <Reply replyComment={reply} />)}
    </div>
  );
};

export default Comment;
