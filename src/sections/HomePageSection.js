import Navbar from "@/components/navbar/Navbar";
import styles from "@/components/home/HomePageSection.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SignUp from "@/components/sign-up/SignUp";
import Login from "@/components/login/Login";
import { useContext, useEffect, useState } from "react";
import { addNewTweet, getAllTweet } from "@/lib/constants/ApiRoutes";
import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
import ContainerSection from "./ContainerSection";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import GlobalDataContext from "@/components/hooks/GlobalContext";
import { toast } from "react-toastify";

const HomePageSection = ({ posts, ref }) => {
  const [window, setWindow] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const handleOpenSignUpWindow = (name) => {
    setWindow(name);
  };
  const [postList, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [getTweetMessage, setGetTweetMessage] = useState("");
  const { socket, newNotification } = useContext(GlobalDataContext);

  const handleUploadNewPost = async (postContents) => {
    if (!user.id) return;
    let response = await addNewTweet({
      body: postContents,
    });
    if (response.data.message === "OK") {
      response = JSON.parse(JSON.stringify(response.data.result));
      setPostList([...response, ...postList]);
    }
  };

  const handleRetweet = async ({ content, tweetId }) => {
    if (!user.id) return;
    let response = await addNewTweet({
      type: "retweet",
      itemId: tweetId,
      body: { text: content, image: "" },
    });
    if (response.data.message === "OK") {
      response = JSON.parse(JSON.stringify(response.data.result));
      setPostList([response.newTweet, ...postList]);
      let notification = response.newNotification;
      socket.emit("send-notification", {
        notification,
        roomNo: notification.to._id,
      });
    }
  };

  const handleLoadNewData = async (page) => {
    setLoading(true);
    try {
      let response = await getAllTweet({ page: page });
      response = JSON.parse(JSON.stringify(response.data.result));
      if (response.length) {
        setPostList([...postList, ...response]);
      } else {
        setGetTweetMessage("You are already caught up.");
      }
    } catch (err) {
      handleApiError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPostList([...posts]);
  }, []);

  useEffect(() => {
    if (!!session && !user) {
      setUser(jwtDecode(session?.user?.accessToken));
    }
  }, [session, postList]);

  useEffect(() => {
    if (currentPage > 1) {
      handleLoadNewData(currentPage);
    }
  }, [currentPage]);

  return (
    <div className={styles["home-page-container"]}>
      <Navbar activeNav={"home"} />
      <ContainerSection
        callBack={handleUploadNewPost}
        user={user}
        posts={postList}
        handleNewData={setCurrentPage}
        loading={loading}
        handleRetweet={handleRetweet}
        tweetMessage={getTweetMessage}
      />
      <Sidebar callBack={handleOpenSignUpWindow} />
      {window === "sign-up" ? (
        <SignUp callBack={handleOpenSignUpWindow} />
      ) : null}
      {window === "login" ? <Login callBack={handleOpenSignUpWindow} /> : null}
    </div>
  );
};

export default HomePageSection;
