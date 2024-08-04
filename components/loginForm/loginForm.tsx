import { JSX, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./loginForm.module.scss";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  
  const login = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
      });
      
      if (!response.ok) {
        const responseBody = await response.json();
        setErrorText(responseBody.error)
      } else {
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      setErrorText("There was an error logging in.")
    }
  };
  
  return (
    <div className={styles.loginForm}>
      <TextField
        id="login-email-input"
        label="Email"
        fullWidth
        onChange={
          (event) => {
            setEmail(event.target.value);
            setErrorText("");
          }
        }
      />
      <TextField
        id="login-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        fullWidth
        onChange={
          (event) => {
            setPassword(event.target.value);
            setErrorText("");
          }
        }
      />
      {
        errorText && <p className={styles.errorText}>{errorText}</p>
      }
      <Button variant="contained" fullWidth size="large" color="primary" endIcon={<LoginIcon/>} onClick={login}>
        Log In
      </Button>
    </div>
  );
}