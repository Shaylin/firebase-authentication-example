"use client";

import { JSX, useState } from "react";
import styles from "./mainMenu.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";

export default function MainMenu(): JSX.Element {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const initiateLogout = async () => {
    setIsLoggingOut(true);
  };
  
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login?loggedOut=true");
  };
  
  const navigateToProfile = () => {
    router.push("/profile");
  };
  
  return (
    <>
      <div className={styles.mainMenu}>
        <Button variant="contained" fullWidth size="large" endIcon={<AccountCircleIcon/>}
          onClick={navigateToProfile}>
          Profile Management
        </Button>
        
        <Divider orientation="horizontal" flexItem/>
        
        <Button variant="contained" fullWidth size="large" color="error" endIcon={<LogoutIcon/>}
          onClick={initiateLogout}>
          Log Out
        </Button>
      </div>
      
      {isLoggingOut && <Dialog
        open={isLoggingOut}
        onClose={() => setIsLoggingOut(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to log out?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setIsLoggingOut(false)}>
            No
          </Button>
          <Button onClick={logout} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>}
    </>
  );
}