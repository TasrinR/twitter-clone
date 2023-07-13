import GlobalDataContext from "@/components/hooks/GlobalContext";
import { fetchRoomMessages, postNewMessage } from "@/lib/constants/ApiRoutes";
import { getFirstLetters } from "@/lib/helper/randomGenerate";
import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "./SingleChat.module.css";

let socket;

const SingleChat = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const messageContainerRef = useRef();
  const { currentRoom, newMessage, socket } = useContext(GlobalDataContext);

  useEffect(() => {
    if (currentRoom) {
      handleFetchRoomMessages();
    }
  }, [currentRoom]);

  useEffect(() => {
    if (!!newMessage) {
      setMessages((messages) => [...messages, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    messageContainerRef?.current?.scroll({
      top: messageContainerRef?.current?.scrollHeight,
    });
  }, [messages]);

  const handleMessageEvent = (e) => {
    setMessageContent(e.target.value);
  };

  const handleFetchRoomMessages = async () => {
    try {
      let params = { roomId: currentRoom };
      let response = await fetchRoomMessages(params);
      response = JSON.parse(JSON.stringify(response?.data?.result));
      setMessages(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setMessageContent("");
      try {
        const response = await postNewMessage({
          message: messageContent,
          roomId: currentRoom,
        });
        if (response.status === 200) {
          let result = response.data.result;
          handleMessageUpdate(result);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleMessageUpdate = (newMessageData) => {
    if (!!newMessageData) {
      socket.emit("send-message", { newMessageData, roomNo: currentRoom });
    }
  };

  return (
    <div className={styles["message-section"]}>
      {!currentRoom ? (
        <p> Please open a chat to see the messages </p>
      ) : (
        <>
          <h2 className={styles["profile-wrapper"]}>{currentRoom}</h2>
          <div className={styles["message-wrapper"]} ref={messageContainerRef}>
            {messages?.map((message) => (
              <div
                className={`${styles["single-message"]} ${
                  message?.sender?._id == id && styles["right"]
                }`}
                key={message._id}
              >
                {message?.sender?.profile?.profilePicture ? (
                  <img src={message?.sender?.profile?.profilePicture}></img>
                ) : (
                  <div
                    style={{
                      backgroundColor: message?.sender?.profile?.bgColor,
                    }}
                  >
                    {getFirstLetters(message?.sender?.profile?.name)}
                  </div>
                )}
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <div className={styles["input-area-wrapper"]}>
            <input
              type={"text"}
              onChange={handleMessageEvent}
              onKeyDown={handleKeyDown}
              className={styles["message-input-area"]}
              value={messageContent}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SingleChat;
