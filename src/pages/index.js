import PropsHandler from "@/lib/middleware/PropsHandler";
import { getAllPosts } from "@/lib/services/PostService";
import HomePageSection from "@/sections/HomePageSection";

export default function Home({ posts }) {
  return <HomePageSection posts={posts} />;
}

export async function getServerSideProps(context) {
  let req = {};
  let response = await PropsHandler(getAllPosts, req);
  response = JSON.parse(JSON.stringify(response));
  return {
    props: {
      posts: response.result,
    },
  };
}
