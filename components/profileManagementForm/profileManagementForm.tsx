"use client";

import { JSX, useEffect, useState } from "react";
import styles from "./profileManagement.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser } from "@/contexts/userContext";

export default function ProfileManagementForm(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  
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
      {!!user ?
        <>
          <div className={styles.mainMenu}>
            <Button variant="contained" fullWidth size="large" endIcon={<AccountCircleIcon/>}
              onClick={navigateToProfile}>
              Profile Management
            </Button>
            <Button variant="contained" fullWidth size="large" color="error" endIcon={<LogoutIcon/>}
              onClick={initiateLogout}>
              Log Out
            </Button>
          </div>
        </> : <p>Unauthorized</p>
      }
      
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