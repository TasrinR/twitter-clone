import User from "../model/User";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "./generateJwtToken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  let user;

  const collection = User;

  const userExists = await collection.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  let profile = {
    bgColor: bgColor,
  };

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    user = await collection.create({
      email,
      password: hashedPassword,
      profile: profile,
    });
  }
  if (user) {
    res.statusCode = 201;
    return user;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const collection = User;

  const user = await collection.findOne({ email });
  const isPasswordMatched = await bcrypt.compare(
    password,
    user?.password || ""
  );
  if (!user || !isPasswordMatched) {
    res.statusCode = 400;
    throw new Error("invalid credential");
  }
  const accessToken = await generateJwtToken(user);
  res.statusCode = 200;
  return accessToken;
};
