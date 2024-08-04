import styles from "./page.module.scss";
import MainMenu from "@/components/mainMenu/mainMenu";
import verifyToken from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home(props: { isVerifiedUser: boolean }) {
  const token = cookies().get("token")?.value || "";
  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }
  
  return (
    <main className={styles.main}>
      {user ?
        <>
          <h1>Main Menu</h1>
          <div className={styles.menu}>
            <MainMenu/>
          </div>
        </> :
        <p>Unauthorized</p>
      }
    </main>
  );
}