import styles from "./page.module.scss";
import { redirect } from "next/navigation";
import ProfileManagementForm from "@/components/profileManagementForm/profileManagementForm";
import { cookies } from "next/headers";
import verifyToken from "@/utils/verifyToken";

export default async function Profile() {
  const token = cookies().get("token")?.value || "";
  const verifiedUser = await verifyToken(token);

  if (!verifiedUser) {
    redirect("/login");
  }
  
  return (
    <main className={styles.main}>
      {verifiedUser ?
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
