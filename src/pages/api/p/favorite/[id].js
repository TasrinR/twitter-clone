import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler"
import { getFavoriteList } from "@/lib/services/FavoriteService"

const handler = async (req, res) => {
  switch ( req.method ) {
    case "GET" : return await getFavoriteList(req, res)
    default: throw new Error("method not allowed")
  }
}

export default RequestAndResponseHandler(handler)