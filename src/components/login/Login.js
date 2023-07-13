import styles from "@/components/login/Login.module.css";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { signIn } from "next-auth/react";
import { useState } from "react";

const Login = ({ callBack }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignInWithCredentials();
  };
  const handleSignInWithCredentials = async () => {
    try {
      const res = await axios.post("/api/p/login", {
        ...credentials,
      });
      const data = await res.data?.result;
      window.localStorage.setItem("accessToken", JSON.stringify(res.data?.result));
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

  const handleSignInWithProvider = async (provider) => {
    signIn(provider);
  };
  return (
    <div className={styles["sign-in-container"]}>
      <div className={styles["sign-in-area"]}>
        <img
          className={styles["close-button"]}
          src="/close.svg"
          onClick={() => callBack("")}
        ></img>
        <h2 className={styles["form-title"]}>Login To Your Account</h2>
        <form onSubmit={handleSubmit} className={styles["form"]}>
          <label className={styles["label"]}>Email</label>
          <input
            type={"email"}
            className={styles["input-field"]}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            value={credentials.email}
          />
          <label className={styles["label"]}>Password</label>
          <input
            type={"password"}
            className={styles["input-field"]}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            value={credentials.password}
          />
          <input
            type={"submit"}
            className={styles["submit-button"]}
            value="Login"
          />
        </form>
        <p className={styles["login-text"]}>
          Don't have an account?{" "}
          <span
            className={styles["login-link"]}
            onClick={() => callBack("sign-up")}
          >
            Sign up
          </span>
        </p>
        <p className={styles["login-text"]}>
          Sign in with{" "}
          <span
            className={styles["login-link"]}
            onClick={() => handleSignInWithProvider("github")}
          >
            Github
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
