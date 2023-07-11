import styles from "@/components/post/PostShowSection.module.css";
import SinglePost from "@/components/post/single-post/SinglePost";

const PostShowSection = ({ posts, user }) => {
  return (
    <div className={styles["all-posts-wrapper"]}>
      {posts?.map((post, index) => (
        <SinglePost key={index} post={post} userId={user?.id} user={user} />
      ))}
    </div>
  );
};

export default PostShowSection;
