import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getAllProfilePosts } from "@/lib/services/PostService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getAllProfilePosts(req, res);
    default:
      throw new Error("method not allowed");
  }
};

export default RequestAndResponseHandler(handler);
