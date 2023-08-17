import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import {
  getNotificationHistory,
  updateNotificationSeen,
} from "@/lib/services/NotificationService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getNotificationHistory(req, res);
    case "PUT":
      return await updateNotificationSeen(req, res);
  }
};

export default RequestAndResponseHandler(handler);
