import jwtDecode from "jwt-decode";

export default async (req, res) => {
  const token = await req.headers["http-x-access-token"];
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized operation");
  }
  const decodedToken = jwtDecode(token)
  const userObject = JSON.parse(JSON.stringify(decodedToken));
  req.user = userObject;
};
