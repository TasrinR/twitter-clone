import styles from "@/components/post/PostShowSection.module.css";
import SinglePost from "@/components/post/single-post/SinglePost";

const PostShowSection = ({ posts }) => {
  return (
    <div className={styles["all-posts-wrapper"]}>
      {posts?.map((post, index) => (
        <SinglePost key={index} post={post} />
      ))}
    </div>
  );
};

export default PostShowSection;
