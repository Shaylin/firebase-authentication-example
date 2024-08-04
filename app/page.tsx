import styles from "./page.module.scss";
import MainMenu from "@/components/mainMenu/mainMenu";
import { useUser } from "@/contexts/userContext";
import { GetServerSideProps } from "next";
import verifyToken from "@/utils/verifyToken";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.cookies.token || "";
  
  const isVerified = await verifyToken(token);
  
  if (!isVerified) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  
  return {
    props: { isVerifiedUser: isVerified },
  };
};

export default function Home(props: { isVerifiedUser: boolean }) {
  const { user } = useUser();
  
  return (
    <main className={styles.main}>
      {!!user ?
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