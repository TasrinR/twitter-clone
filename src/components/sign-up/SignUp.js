import styles from "@/components/sign-up/SignUp.module.css";
import { handleApiError } from "@/lib/helper/ErrorHandling";
import axios from "axios";
import { useState } from "react";

const SignUp = ({ callBack }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.password == credentials.confirmPassword) {
      let userObject = {
        email: credentials.email,
        password: credentials.password,
      };
      handleSignUp(userObject);
    }
  };

  const handleSignUp = async (userObject) => {
    try {
      const res = await axios.post("/api/p/signup", {
        ...userObject,
      });
      const data = await res.data;
      if (res.status === 201) {
        callBack("login");
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <div className={styles["sign-up-container"]}>
      <div className={styles["sign-up-area"]}>
        <img
          className={styles["close-button"]}
          src="/close.svg"
          onClick={() => callBack("")}
        ></img>
        <h2 className={styles["form-title"]}>Create Your Account</h2>
        <form onSubmit={handleSubmit} className={styles["form"]}>
          <label className={styles["label"]}>Email</label>
          <input
            type={"email"}
            className={styles["input-field"]}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <label className={styles["label"]}>Password</label>
          <input
            type={"password"}
            className={styles["input-field"]}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <label className={styles["label"]}>Confirm Password</label>
          <input
            type={"password"}
            className={styles["input-field"]}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                confirmPassword: e.target.value,
              })
            }
          />
          <input
            type={"submit"}
            className={styles["submit-button"]}
            value="Create Account"
          />
        </form>
        <p className={styles["login-text"]}>
          Already have an account?{" "}
          <span
            className={styles["login-link"]}
            onClick={() => callBack("login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
