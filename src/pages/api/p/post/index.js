import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getAllPosts } from "@/lib/services/PostService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getAllPosts(req, res);
    default:
      throw new Error("method not allowed");
  }
};

export default RequestAndResponseHandler(handler);
