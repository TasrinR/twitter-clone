import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getAllPosts } from "@/lib/services/PostService";

const handler = async(req, res) => {
  switch(req.method) {
    case "GET" : return await getAllPosts(req, res)
  }
}

export default RequestAndResponseHandler(handler)