"use client";

import {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { IUserData } from "./typings/users/IUserData";
import { Authentication } from "./core/authentication/authentication";

interface AuthContextType {
   user: IUserData | null;
   isAuthenticated: boolean;
   authState: boolean;
   loginWithDiscord: () => Promise<void>;
   verifyOtp: (code: string) => Promise<boolean>;
   resendOtp: () => Promise<void>;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<IUserData | null>(null);
   const [authState, setAuthState] = useState<boolean>(false);

   const router = useRouter();

   useEffect(() => {
      const authentication = new Authentication();
      const token = localStorage.getItem("token");

      if (token) {
         authentication.getUserTokenData(token).then((tokenData) => {
            if (tokenData && tokenData.data && tokenData.data[0].data) {
               console.log(tokenData);

               setUser(tokenData.data[0].data);
            }
         });
      }
      setAuthState(true);
   }, []);

   const loginWithDiscord = async (): Promise<void> => {};

   const verifyOtp = async (code: string): Promise<boolean> => {
      const authentication = new Authentication();
      const verifyResult = await authentication.sumbitEmailVerificationCode(
         localStorage.getItem("token") || "n/a",
         code,
      );

      if (verifyResult.errors) {
         return false;
      }

      return true;
   };

   const resendOtp = async (): Promise<void> => {
      const authentication = new Authentication();
      await authentication.resendEmailVerificationCode(
         localStorage.getItem("token") || "n/a",
      );
   };

   const logout = () => {
      setUser(null);
      router.push("/");
      localStorage.clear();
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated: !!user && user.emailVerificationPassed,
            loginWithDiscord,
            authState,
            verifyOtp,
            resendOtp,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}
