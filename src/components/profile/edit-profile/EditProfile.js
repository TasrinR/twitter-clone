import React, { useContext, useEffect, useState } from "react";
import styles from "@/components/profile/edit-profile/EditProfile.module.css";
import { updateUserBasicInfo } from "@/lib/constants/ApiRoutes";
import { signOut } from "next-auth/react";
import { handleApiError } from "@/lib/helper/ErrorHandling";

const EditProfile = ({ callBack, profileInfo }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (!profile) {
      setProfile(profileInfo);
    }
  }, [profileInfo]);

  const handleDataChange = (e) => {
    e.preventDefault;
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    switch (fieldName) {
      case "name":
        setProfile({ ...profile, name: fieldValue });
        break;
      case "bio":
        setProfile({ ...profile, bio: fieldValue });
        break;
      case "username":
        setProfile({ ...profile, username: fieldValue });
        break;
      case "websiteUrl":
        setProfile({ ...profile, websiteUrl: fieldValue });
        break;
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    let params = {
      name: profile?.name,
      profilePicture: "",
      coverImage: "",
      bio: profile?.bio,
      username: profile?.username,
      websiteUrl: profile?.websiteUrl,
      bgColor: profile?.bgColor,
    };
    try {
      const res = await updateUserBasicInfo(params);
      if (res.status == 200) {
        await signOut({
          callbackUrl: "/",
        });
        callBack();
      }
    } catch (error) {
      handleApiError(err);
    }
  };

  return (
    <div className={styles["container"]}>
      <form className={styles["field-area"]} onSubmit={handleProfileUpdate}>
        <h2 className={styles["form-title"]}> Edit your profile </h2>
        <img
          className={styles["close-button"]}
          src="/close.svg"
          onClick={() => callBack("")}
        ></img>
        <div className={styles["cover-image-area"]}>
          <input type={"file"} className={styles["file"]} />
          <img
            src={profile?.coverImage || "/add-image.png"}
            className={styles["add-image"]}
          />
        </div>
        <div className={styles["content"]}>
          <div className={styles["profile-image-area"]}>
            <input type={"file"} className={styles["file"]} />
            <img
              src={profile?.profilePicture || "/add-image.png"}
              className={styles["add-image"]}
            />
          </div>
          <label className={styles["label"]}>Name</label>
          <input
            type="text"
            className={styles["input-field"]}
            name={"name"}
            value={profile?.name}
            onChange={handleDataChange}
          ></input>
          <label className={styles["label"]}>Bio</label>
          <input
            type="text"
            className={styles["input-field"]}
            name={"bio"}
            value={profile?.bio}
            onChange={handleDataChange}
          ></input>
          <label className={styles["label"]}>Username</label>
          <input
            type="text"
            className={styles["input-field"]}
            name={"username"}
            value={profile?.username}
            onChange={handleDataChange}
          ></input>
          <label className={styles["label"]}>Website</label>
          <input
            type="text"
            className={styles["input-field"]}
            name={"websiteUrl"}
            value={profile?.websiteUrl}
            onChange={handleDataChange}
          ></input>
          <label className={styles["label"]}>Date Of Birth</label>
          <input
            type="date"
            min="1980-01-01"
            max="2028-12-31"
            className={styles["input-field"]}
          ></input>
          <input
            type={"submit"}
            className={styles["submit-button"]}
            value="Save Changes"
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
