import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getAllProfileTweets } from "@/lib/services/TweetService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getAllProfileTweets(req, res);
    default:
      throw new Error("method not allowed");
  }
};

export default RequestAndResponseHandler(handler);