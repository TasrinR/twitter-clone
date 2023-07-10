import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { createPost, getAllPosts } from "@/lib/services/PostService";

const handler = async(req, res) => {
  switch(req.method) {
    case "POST" : return await createPost(req, res);
    case "GET" : return await getAllPosts(req, res)
  }
}

export default RequestAndResponseHandler(handler)