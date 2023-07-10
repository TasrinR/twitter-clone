import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { login } from "@/lib/services/AuthService";

const handler = async (req, res) => {
  if (req.method === "POST") {
    return await login(req, res);
  }
};

export default RequestAndResponseHandler(handler);
