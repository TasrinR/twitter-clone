import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler"
import { OpenChat } from "@/lib/services/ChatService"

const handler = async(req, res) => {
  switch(req.method) {
    case "POST" : return await OpenChat(req, res);
    default: throw new Error("method not allowed")
  }
}

export default RequestAndResponseHandler(handler)