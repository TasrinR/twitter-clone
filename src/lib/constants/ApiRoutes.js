import { server } from "@/config/index";
import axios from "axios";

const API = axios.create({ baseURL: server });

API.interceptors.request.use((req) => {
  if (typeof (window !== undefined)) {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    req.headers["http-x-twitter-key-name"] = process.env.NEXT_PUBLIC_API_KEY;
    req.headers["http-x-access-token"] = accessToken;
  }
  return req;
});

export const getAllTweet = (params) =>
  API.get(`/api/p/post?page=${params?.page}`);
export const uploadTweet = (formData) => API.post("/api/a/post", formData);
export const updateUserBasicInfo = (formData) =>
  API.post("/api/a/user/basic-info", formData);
export const getUserFavoriteList = ({ userId }) =>
  API.get(`/api/p/favorite/${userId}`);
export const getChatRooms = ({ userId }) => API.get(`/api/a/chat/${userId}`);
export const openChatRooms = (chatBody) => API.post("api/a/chat", chatBody);
export const fetchRoomMessages = (params) =>
  API.get(`/api/a/message?roomId=${params.roomId}`);
export const postNewMessage = (postBody) =>
  API.post(`/api/a/message`, postBody);
export const favoriteItems = (data) =>
  API.post(`/api/a/favorite?criteria=${data.criteria}&itemId=${data.itemId}`);
export const addComment = (data) =>
  API.post(`/api/a/comment?postId=${data.postId}`, data.body);
export const addReply = (data) =>
  API.post(
    `/api/a/comment?postId=${data.postId}&commentId=${data.commentId}`,
    data.body
  );
