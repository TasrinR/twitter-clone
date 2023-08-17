import { getChatRooms, getUserFavoriteList } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

const GlobalDataContext = createContext({});

export const GlobalDataProvider = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState();
  const [socket, setSocket] = useState();
  const [currentRoom, setCurrentRoom] = useState();
  const [availableUser, setAvailableUser] = useState();
  const [rooms, setRooms] = useState();
  const [newMessage, setNewMessage] = useState();
  const [newMessageNotification, setNewMessageNotification] = useState();
  const [newNotification, setNewNotification] = useState();

  useEffect(() => {
    if (session && !user) {
      let decodedToken = jwtDecode(session.user?.accessToken);
      setUser(decodedToken);
      getAllFollowingUser(decodedToken);
      handleAllUserRooms(decodedToken);
    }
  }, [session]);

  useEffect(() => {
    socketInitializer();
    if (currentRoom == newMessageNotification) {
      setNewMessageNotification();
    }
    return () => {
      socket?.disconnect();
    };
  }, [currentRoom]);

  useEffect(() => {
    socket?.on("receive-message", (data) => {
      if (data.roomNo == currentRoom) {
        setNewMessage(data.newMessageData);
        setNewMessageNotification();
      } else {
        let roomAvailable = rooms?.find((room) => room.roomId == data.roomNo);
        if (!!roomAvailable) {
          setNewMessageNotification(data.roomNo);
          setNewMessage();
        }
      }
    });
    socket?.on("recieve-notification", (data) => {
      setNewNotification(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!!newNotification && newNotification?.roomNo == user.id) {
      let { notification } = newNotification;
      let { from } = notification;
      toast.success(`${from.profile.name} ${notification.message}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  }, [newNotification]);

  async function socketInitializer() {
    await fetch(`/api/socket?currentRoom=${currentRoom}`);
    setSocket(io());
  }

  const getAllFollowingUser = async (user) => {
    try {
      let response = await getUserFavoriteList({ userId: user.id });
      response = JSON.parse(JSON.stringify(response?.data?.result));
      setAvailableUser(response?.followingList);
    } catch (err) {}
  };

  const handleAllUserRooms = async (user) => {
    try {
      let response = await getChatRooms({ userId: user.id });
      response = JSON.parse(JSON.stringify(response?.data?.result));
      setRooms(response);
    } catch (err) {
      handleApiError;
    }
  };

  return (
    <GlobalDataContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        newMessage,
        newMessageNotification,
        newNotification,
        setNewNotification,
        socket,
        availableUser,
        setAvailableUser,
        rooms,
        setRooms,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export default GlobalDataContext;
