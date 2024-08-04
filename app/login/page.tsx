"use client";

import Snackbar from "@mui/material/Snackbar";
import styles from "./page.module.scss";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/loginForm/loginForm";
import SignupForm from "@/components/signupForm/signupForm";
import { Divider } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { Suspense } from "react";

function Login() {
  const searchParams = useSearchParams();
  const [wasLoggedOut, setWasLoggedOut] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true);
  const [signedUpSuccessfully, setSignedUpSuccessfully] = useState<boolean>(false);
  
  useEffect(() => {
    if (searchParams.get("loggedOut")) {
      setWasLoggedOut(true);
    }
  }, [searchParams]);
  
  const handleLoggedOutMessageClose = (event: Event | React.SyntheticEvent<any>, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setWasLoggedOut(false);
  };
  
  const handleSignedUpSuccessfullyClosed = (event: Event | React.SyntheticEvent<any>, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSignedUpSuccessfully(false);
  };
  
  const onSignUpSuccess = () => {
    setIsLoggingIn(true);
    setSignedUpSuccessfully(true);
  };
  
  return (
    <>
      <main className={styles.main}>
        <h1>Login</h1>
        <div className={styles.menu}>
          {isLoggingIn ? <LoginForm/> : <SignupForm onSignUpSuccess={onSignUpSuccess}/>}
          <Divider orientation="horizontal"/>
          
          {isLoggingIn ?
            <>
              <p>{"Don't have an account?"}</p>
              <Button variant="contained" fullWidth size="large" color="secondary" endIcon={<AppRegistrationIcon/>}
                onClick={() => setIsLoggingIn(false)}>
                Sign Up
              </Button>
            </> :
            <>
              <p>Already have an account?</p>
              <Button variant="contained" fullWidth size="large" color="secondary" endIcon={<LoginIcon/>}
                onClick={() => setIsLoggingIn(true)}>
                Log In
              </Button>
            </>
          }
        </div>
      </main>
      <Snackbar
        open={wasLoggedOut}
        autoHideDuration={5000}
        onClose={handleLoggedOutMessageClose}
        message="You have been logged out."
      />
      <Snackbar
        open={signedUpSuccessfully}
        autoHideDuration={5000}
        onClose={handleSignedUpSuccessfullyClosed}
        message="Signed up successfully. Please log in."
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login/>
    </Suspense>
  );
}