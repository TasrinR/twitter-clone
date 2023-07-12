import PropsHandler from "@/lib/middleware/PropsHandler";
import { getAllTweet } from "@/lib/services/TweetService";
import HomePageSection from "@/sections/HomePageSection";

export default function Home({ posts }) {
  return <HomePageSection posts={posts} />;
}

export async function getServerSideProps(context) {
  let req = {};
  let response = await PropsHandler(getAllTweet, req);
  response = JSON.parse(JSON.stringify(response));
  return {
    props: {
      posts: response.result,
    },
  };
}
