import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { register } from "@/lib/services/AuthService";

const handler = async (req, res) => {
  if (req.method === "POST") {
    return await register(req, res);
  }
  else {
    throw new Error("method not allowed")
  }
};

export default RequestAndResponseHandler(handler);
