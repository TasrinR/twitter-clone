import Login from "@/components/login/Login";
import Navbar from "@/components/navbar/Navbar";
import ProfileContent from "@/components/profile/content/ProfileContent";
import EditProfile from "@/components/profile/edit-profile/EditProfile";
import FollowArea from "@/components/profile/follow-area/FollowArea";
import styles from "@/components/profile/ProfileSection.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SignUp from "@/components/sign-up/SignUp";
import { addNewTweet, getAllProfileTweet } from "@/lib/constants/ApiRoutes";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContainerSection from "./ContainerSection";

const ProfileSection = ({ posts, userInfo }) => {
  const [profileWindow, setProfileWindow] = useState(false);
  const { data: session } = useSession();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [getTweetMessage, setGetTweetMessage] = useState("");

  useEffect(() => {
    if (!!session && !profile) {
      const decodedUser = jwtDecode(session?.user?.accessToken);
      setProfile(decodedUser);
    }
  }, [session, profile]);

  useEffect(() => {
    setPostList(posts);
  }, [posts]);

  const handleShowProfileWindow = (window) => {
    setProfileWindow(window);
  };

  const [window, setWindow] = useState("");
  const handleOpenSignUpWindow = (name) => {
    setWindow(name);
  };

  const handleRetweet = async ({ content, tweetId }) => {
    let response = await addNewTweet({
      type: "retweet",
      itemId: tweetId,
      body: { text: content, image: "" },
    });
    if (response.data.message === "OK") {
      alert("tweet shared on your profile");
    }
  };

  const handleLoadNewData = async (page) => {
    setLoading(true);
    try {
      let response = await getAllProfileTweet({ id: userInfo._id, page: page });
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
    if (currentPage > 1) {
      handleLoadNewData(currentPage);
    }
  }, [currentPage]);

  return (
    <div className={styles["profile-page-section"]}>
      <Navbar activeNav={userInfo?._id == profile?.id ? "profile" : ""} />
      <ProfileContent
        callBack={handleShowProfileWindow}
        profileContent={userInfo}
        totalPosts={posts?.length}
        userProfile={profile}
      />
      <ContainerSection
        isProfilePage={true}
        handleRetweet={handleRetweet}
        posts={postList}
        handleNewData={setCurrentPage}
        user={profile}
        loading={loading}
        tweetMessage={getTweetMessage}
      />
      <Sidebar callBack={handleOpenSignUpWindow} />
      {window === "sign-up" && <SignUp callBack={handleOpenSignUpWindow} />}
      {window === "login" && <Login callBack={handleOpenSignUpWindow} />}
      {profileWindow == "edit" && (
        <EditProfile
          callBack={handleShowProfileWindow}
          profileInfo={profile.profile}
        />
      )}
      {profileWindow == "favorite" && (
        <FollowArea
          userId={userInfo?._id}
          callBack={handleShowProfileWindow}
          followerList={profile?.followerList}
          followingList={profile?.followingList}
          currentUserId={profile?.id}
        />
      )}
    </div>
  );
};

export default ProfileSection;
