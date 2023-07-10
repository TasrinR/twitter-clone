import Navbar from "@/components/navbar/Navbar";
import styles from "@/components/home/HomePageSection.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SignUp from "@/components/sign-up/SignUp";
import Login from "@/components/login/Login";
import { useEffect, useState } from "react";
import { getAllTweet, uploadTweet } from "@/lib/constants/ApiRoutes";
import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
import ContainerSection from "./ContainerSection";

const HomePageSection = ({ posts, ref }) => {
  const [window, setWindow] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const handleOpenSignUpWindow = (name) => {
    setWindow(name);
  };
  const [postList, setPostList] = useState([]);

  const handleUploadNewPost = async (postContents) => {
    let response = await uploadTweet(postContents);
    if (response.data.message === "OK") {
      response = JSON.parse(JSON.stringify(response.data.result));
      setPostList([...response, ...postList]);
    }
  };

  const handleLoadNewData = async (page) => {
    setLoading(true);
    try {
      let response = await getAllTweet({ page: page });
      response = JSON.parse(JSON.stringify(response.data.result));
      setPostList([...postList, ...response]);
    } catch (err) {
      console.log(err);
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

  return (
    <div className={styles["home-page-container"]}>
      <Navbar activeNav={"home"} />
      <ContainerSection
        callBack={handleUploadNewPost}
        user={user}
        posts={postList}
        handleNewData={handleLoadNewData}
        loading={loading}
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
