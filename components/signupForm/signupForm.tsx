"use client";

import { JSX, useState } from "react";
import Button from "@mui/material/Button";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import styles from "./signupForm.module.scss";
import TextField from "@mui/material/TextField";

export default function SignupForm(props: {onSignUpSuccess: () => void}): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  
  const signup = async () => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
      });
      
      if (!response.ok) {
        const responseBody = await response.json();
        setErrorText(responseBody.error)
      } else {
        props.onSignUpSuccess();
      }
    } catch (e) {
      console.error(e);
      setErrorText("Sign up error.");
    }
  };
  
  return (
    <div className={styles.signupForm}>
      <TextField
        id="signup-email-input"
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
        id="signup-password-input"
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
      <Button variant="contained" fullWidth size="large" color="primary" endIcon={<AppRegistrationIcon/>}
        onClick={signup}>
        Sign Up
      </Button>
    </div>
  );
}