import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { postTweet } from "@/lib/services/TweetService";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await postTweet(req, res);
    default:
      throw new Error("method not allowed");
  }
};

export default RequestAndResponseHandler(handler);
