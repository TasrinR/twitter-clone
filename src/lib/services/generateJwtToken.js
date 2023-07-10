import jwt from "jsonwebtoken";

export const generateJwtToken = (user) => {
  const { _id, email, profile, followerList, followingList, isProfileComplete } = user;
  let id = _id.valueOf();
  const jwtToken = jwt.sign(
    {
      id,
      email,
      profile,
      followerList,
      followingList,
      isProfileComplete,
    },
    process.env.NEXTAUTH_SECRET,
    {
      expiresIn: "8h",
    }
  );
  return jwtToken;
};
