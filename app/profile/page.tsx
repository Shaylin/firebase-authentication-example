"use client";

import styles from "./page.module.scss";
import { useUser } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileManagementForm from "@/components/profileManagementForm/profileManagementForm";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  
  return (
    <main className={styles.main}>
      {!!user ?
        <>
          <h1>Profile Management</h1>
          <div className={styles.menu}>
            <ProfileManagementForm/>
          </div>
        </> :
        <p>Unauthorized</p>
      }
    </main>
  );
}
