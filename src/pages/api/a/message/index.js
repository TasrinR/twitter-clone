import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler"
import { FetchRoomMessages, PostMessage } from "@/lib/services/MessageService"

const handler = async(req, res) => {
  switch(req.method) {
    case "POST": return await PostMessage(req, res);
    case "GET" : return await FetchRoomMessages(req, res);
    default: throw new Error("method not allowed")
  }
}

export default RequestAndResponseHandler(handler)