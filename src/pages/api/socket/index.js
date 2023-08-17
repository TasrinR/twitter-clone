import RequestAndResponseHandler from "@/lib/middleware/RequestAndResponseHandler";
import { Server } from "socket.io";

const handler = async (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("send-message", (obj) => {
        io.emit("receive-message", obj);
      });

      socket.on("send-notification", (obj) => {
        io.emit("recieve-notification", obj)
      })
    });
  }
};

export default RequestAndResponseHandler(handler);
