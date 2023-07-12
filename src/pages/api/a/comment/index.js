import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { addComment } from "@/lib/services/PostService";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await addComment(req, res);
    default:
      throw new Error("method not allowed");
  }
};

export default RequestAndResponseHandler(handler);
