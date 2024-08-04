"use client";

import React, { JSX, useState } from "react";
import styles from "./profileManagement.module.scss";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import { getCookie } from "cookies-next";

export default function ProfileManagementForm(): JSX.Element {
  const router = useRouter();
  const [hasUpdatedPassword, setHasUpdatedPassword] = useState<boolean>(false);
  const [updatedPassword, setUpdatedPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  
  const handleClose = (event: Event | React.SyntheticEvent<any>, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setHasUpdatedPassword(false);
  };
  
  const updatePassword = async () => {
    try {
      const token = getCookie("token") || "";
      
      const response = await fetch("/api/password", {
        method: "PUT",
        body: JSON.stringify({ userIdToken: token, password: updatedPassword })
      });
      
      if (!response.ok) {
        const responseBody = await response.json();
        setErrorText(responseBody.error)
      }
      
      setHasUpdatedPassword(true);
    } catch (e) {
      console.error(e);
      setErrorText("There was an error updating your password.")
      setHasUpdatedPassword(false);
    }
  };
  
  const navigateToHome = () => {
    router.push("/");
  };
  
  return (
    <div className={styles.mainMenu}>
      <TextField
        id="change-password-input"
        label="Set A New Password"
        type="password"
        fullWidth
        onChange={
          (event) => {
            setUpdatedPassword(event.target.value);
            setErrorText("");
          }
        }
      />
      {
        errorText && <p className={styles.errorText}>{errorText}</p>
      }
      <Button variant="contained" fullWidth size="large" color="warning" endIcon={<LogoutIcon/>}
        onClick={updatePassword}>
        Update Password
      </Button>
      
      <Divider orientation="horizontal" flexItem/>
      
      <Button variant="contained" fullWidth size="large" endIcon={<HomeIcon/>}
        onClick={navigateToHome}>
        Home
      </Button>
      
      <Snackbar
        open={hasUpdatedPassword}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Password updated successfully."
      />
    </div>
  );
}