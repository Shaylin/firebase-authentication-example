import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCookie } from "cookies-next";

interface User {
  userIdToken: string;
  isVerified: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      verifyToken(token).then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    } else {
      console.error("No cookie found");
    }
  }, []);
  
  const verifyToken = async (token: string): Promise<User | null> => {
    console.log(token);
    const res = await fetch("/api/verifyUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIdToken: token }),
    });
    if (res.ok) {
      return res.json();
    }
    return null;
  };
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};