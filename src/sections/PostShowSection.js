import styles from "@/components/post/PostShowSection.module.css";
import SinglePost from "@/components/post/single-post/SinglePost";

const PostShowSection = ({ posts, user, handleFetchComments, handleRetweet, isProfilePage }) => {
  return (
    <div className={styles["all-posts-wrapper"]}>
      {posts?.map((post, index) => (
        <SinglePost
          key={index}
          post={post}
          userId={user?.id}
          user={user}
          callBack={handleFetchComments}
          handleRetweet={handleRetweet}
          isProfilePage={isProfilePage}
        />
      ))}
    </div>
  );
};

export default PostShowSection;
