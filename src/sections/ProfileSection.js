import Login from "@/components/login/Login";
import Navbar from "@/components/navbar/Navbar";
import ProfileContent from "@/components/profile/content/ProfileContent";
import EditProfile from "@/components/profile/edit-profile/EditProfile";
import FollowArea from "@/components/profile/follow-area/FollowArea";
import styles from "@/components/profile/ProfileSection.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SignUp from "@/components/sign-up/SignUp";
import { addNewTweet } from "@/lib/constants/ApiRoutes";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostShowSection from "./PostShowSection";

const ProfileSection = ({ posts, userInfo }) => {
  const [profileWindow, setProfileWindow] = useState(false);
  const { data: session } = useSession();
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (!!session && !profile) {
      const decodedUser = jwtDecode(session?.user?.accessToken);
      setProfile(decodedUser);
    }
  }, [session, profile]);

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
      alert("tweet shared on your profile")
    }
  };

  return (
    <div className={styles["profile-page-section"]}>
      <Navbar activeNav={userInfo?._id == profile?.id ? "profile" : ""} />
      <ProfileContent
        callBack={handleShowProfileWindow}
        profileContent={userInfo}
        totalPosts={posts?.length}
        userProfile={profile}
      />
      <div className={styles["post-container"]}>
        <PostShowSection
          posts={posts}
          user={profile}
          isProfilePage={true}
          handleRetweet={handleRetweet}
        />
      </div>
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
        />
      )}
    </div>
  );
};

export default ProfileSection;
