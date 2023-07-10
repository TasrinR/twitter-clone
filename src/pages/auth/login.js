import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
import jwtDecode from "jwt-decode";

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
      console.log(err);
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
      console.log(err);
    }
  };
  return (
    <div className={styles["sign-in-section"]}>
      <>
        <button onClick={() => handleSignIn("github")}>Sign In</button>
        <div
          className={styles["credential-area"]}
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
          className={styles["credential-area"]}
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
