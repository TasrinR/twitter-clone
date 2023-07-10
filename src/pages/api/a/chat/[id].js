import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { getUserChatRooms } from "@/lib/services/ChatService";

const handler = async(req, res) => {
  switch(req.method) {
    case "GET" : return await getUserChatRooms(req, res);
  }
}

export default RequestAndResponseHandler(handler)