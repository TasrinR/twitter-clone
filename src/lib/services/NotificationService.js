import { ObjectId } from "bson";
import Notification from "../model/Notification";

export const getNotificationHistory = async (req, res) => {
  const { id } = req.user;
  let notificationHistory = await Notification.find({ to: new ObjectId(id) })
    .populate("to", "email profile.name profile.profilePicture profile.bgColor")
    .populate(
      "from",
      "email profile.name profile.profilePicture profile.bgColor"
    )
    .sort({ _id: -1 });
  return notificationHistory;
};

export const updateNotificationSeen = async (req, res) => {
  const itemId = req.query.id;
  let updatedNotification = await Notification.findOneAndUpdate(
    { itemId: itemId },
    {
      $set: { seen: true },
    }
  );
  return updatedNotification;
};
