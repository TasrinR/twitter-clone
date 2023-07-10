import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { createUserBasicInfo, updateUserBasicInfo } from "@/lib/services/userProfileService";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await createUserBasicInfo(req, res);
  }
};

export default RequestAndResponseHandler(handler);
