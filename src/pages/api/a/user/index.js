import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler"
import { getUserInfo } from "@/lib/services/userProfileService"

const handler = async(req, res) => {
  switch(req.method) {
    case "GET" : return await getUserInfo(req, res)
  }
}

export default RequestAndResponseHandler(handler)