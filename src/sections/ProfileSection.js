import Login from "@/components/login/Login";
import Navbar from "@/components/navbar/Navbar";
import ProfileContent from "@/components/profile/content/ProfileContent";
import EditProfile from "@/components/profile/edit-profile/EditProfile";
import FollowArea from "@/components/profile/follow-area/FollowArea";
import styles from "@/components/profile/ProfileSection.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SignUp from "@/components/sign-up/SignUp";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostShowSection from "./PostShowSection";

const ProfileSection = ({ posts, userInfo }) => {
  const [profileWindow, setProfileWindow] = useState(false);
  const [showFollowArea, setShowFollowArea] = useState(false);
  const { data: session } = useSession();
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (!!session) {
      const decodedUser = jwtDecode(session?.user?.accessToken);
      setProfile(decodedUser);
    }
  }, [session]);

  const handleShowProfileWindow = (window) => {
    setProfileWindow(window);
  };

  const handleShowFollowArea = (flag) => {
    setShowFollowArea(flag);
  };
  const [window, setWindow] = useState("");
  const handleOpenSignUpWindow = (name) => {
    setWindow(name);
  };

  return (
    <div className={styles["profile-page-section"]}>
      <Navbar activeNav={"profile"} />
      <ProfileContent
        callBack={handleShowProfileWindow}
        profileContent={userInfo}
        totalPosts={posts?.length}
      />
      <div className={styles["post-container"]}>
        <PostShowSection posts={posts} />
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
          userId={profile?.id}
          callBack={handleShowProfileWindow}
          followerList={profile?.followerList}
          followingList={profile?.followingList}
        />
      )}
    </div>
  );
};

export default ProfileSection;
