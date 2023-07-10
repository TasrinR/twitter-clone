import { getChatRooms, getUserFavoriteList } from "@/lib/constants/ApiRoutes";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
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
    if (currentRoom == newNotification) {
      setNewNotification();
    }
    return () => {
      socket?.disconnect();
    };
  }, [currentRoom]);

  useEffect(() => {
    socket?.on("receive-message", (data) => {
      if (data.roomNo == currentRoom) {
        setNewMessage(data.newMessageData);
        setNewNotification();
      } else {
        let roomAvailable = rooms?.find((room) => room.roomId == data.roomNo);
        if (!!roomAvailable) {
          setNewNotification(data.roomNo);
          setNewMessage();
        }
      }
    });
  }, [socket]);

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
      console.log(err);
    }
  };

  return (
    <GlobalDataContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        newMessage,
        newNotification,
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
