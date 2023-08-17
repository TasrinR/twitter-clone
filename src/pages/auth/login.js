import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { handleApiError } from "@/lib/helper/ErrorHandling";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSignIn = (provider) => {
    signIn(provider, { callbackUrl: "http://localhost:3000" });
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post("/api/p/signup", {
        ...credentials,
      });
      const data = await res.data;
      if (res.status === 201) {
        signIn("credentials", {
          ...data,
          callbackUrl: "http://localhost:3000",
        });
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleSignInWithCredentials = async () => {
    try {
      const res = await axios.post("/api/p/login", {
        ...credentials,
      });
      const data = await res.data?.result;
      const decodedData = await jwtDecode(data);
      if (res.status === 200) {
        signIn("credentials", {
          ...decodedData,
          accessToken: data,
          callbackUrl: "http://localhost:3000",
        });
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <div>
      <>
        <button onClick={() => handleSignIn("github")}>Sign In</button>
        <div
          styles={{ marginTop: "100px" }}
        >
          <h2>Sign In</h2>
          <input
            type={"text"}
            placeholder="email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <button onClick={() => handleSignInWithCredentials()}>Submit</button>
        </div>
        <div
          styles={{ marginTop: "100px" }}
        >
          <h2>Sign Up</h2>
          <input
            type={"text"}
            placeholder="email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <button onClick={() => handleSignUp()}>Submit</button>
        </div>
      </>
    </div>
  );
};

export default Login;
