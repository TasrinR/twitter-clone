import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getAllTweet } from "@/lib/services/TweetService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getAllTweet(req, res);
    default: throw new Error("method not allowed")
  }
};

export default RequestAndResponseHandler(handler);
