"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUser } from "@/lib/user-context";
import { LoginForm } from "@/components/login-form";
import { DashboardHeader } from "@/components/dashboard-header";
import { DevicesGrid } from "@/components/devices-grid";
import { isBackendAvailable } from "@/lib/core";
import { IUserSettings } from "@/lib/typings/users/IUserSettings";
import { Users } from "@/lib/core/users/users";
import { useTheme } from "next-themes";
import { Firebase } from "@/lib/core/firebase/firebase";
import { UAParser } from "ua-parser-js";

export default function Home() {
   const { isAuthenticated, user, authState } = useAuth();
   const router = useRouter();
   const [backendAvailable, setBackendAvailableState] = useState<boolean>(true);
   let [userSettings, setUserSettings] = useState<
      IUserSettings | undefined | false
   >(undefined);
   const { theme, setTheme } = useTheme();

   useEffect(() => {
      localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIwMTllMjQxZC03MTNlLTcwMDAtOTg1Yi04MmQ3MTIzYjQxY2UiLCJzZXNzaW9uT3duZXJJZCI6IjAxOWUyMTIwLTM3MDQtNzAwMC1hZjYzLTQ0YTQwMTdhZDhiOCIsImNyZWF0ZURhdGUiOjE3Nzg3MjIzNjksImlzQ2xvc2VkIjpmYWxzZSwiSVBBZGRyZXNzIjoiMS4xLjEuMSIsImdlb0xvY2F0aW9uIjoiWy0zMy40OTQsMTQzLjIxMDRdIiwiX2lkIjoiNmEwNTI2NDExMDdmNzU0YmM1NDJhMzM0IiwiX192IjowLCJpYXQiOjE3Nzg3MjIzNjl9.pTdkm6z1PXKoWN9peafR-8Ob-x-cfsH3jp4HrbJQVsA")
      localStorage.setItem("userData", '{"_id":"6a04625ca7bd53b4311fb928","userId":"019e2120-3704-7000-af63-44a4017ad8b8","username":"literaryaturtle","displayName":"eo chua","email":"d.oragamerff@gmail.com","preSignInSetupCompleted":true,"authType":"oauth","configurationObjectId":"019e2120-3704-7001-9dc1-bb21cfddd765","emailVerificationPassed":true,"emailVerificationCode":"0e06af988b8600b08cccac85ddd9321a0d79daed7085de70d07b87587e05dafd","emailLatestRequestDate":1778672221,"hashedPassword":"$argon2id$v=19$m=65536,t=2,p=1$Aqh5Dz8NqUIW1++Y4+aUWToqDuqiAhtzntLbNJ5dqGY$J4lMOAUYL3meyIuI9MkONQE+FenmLX4Z1vlSzGiFM+c","avatar":"https://cdn.discordapp.com/avatars/1330431331057799209/f27c041b0067fc00c9ea3aa5658cfe19.png","createDate":1778672219,"isBanned":0,"banPeroid":0,"role":["1"],"__v":0}') 
      localStorage.setItem("s", 1)
      localStorage.setItem("settingsObjectId", "019e2120-3704-7001-9dc1-bb21cfddd765")
      if (user && !user.emailVerificationPassed) {
         router.push("/verify");
      }
      (async () => {
         const available = await isBackendAvailable();
         if (!available) setBackendAvailableState(false);
         console.log("backend health", available);

         const userSettings = await new Users().getUserSettings();
         console.log(userSettings);
         if (!userSettings) {
            localStorage.clear();
            setUserSettings(false);
            console.log("abc abc abc");
            return;
         }
         setUserSettings(userSettings[0].data);
         setTheme(userSettings[0].data.theme);
      })();
   }, [user, router]);

   useEffect(() => {
      if (!isAuthenticated) return;

      const firebase = new Firebase();

      firebase
         .requestToken()
         .then((token) => {
            console.log("TOKEN RECEIVED", token);
            const parser = new UAParser();
            const result = parser.getResult();

            const parts = [
               result.device.vendor, // e.g. "Apple", "Samsung"
               result.device.model, // e.g. "iPhone", "Galaxy S21"
               result.os.name, // e.g. "iOS", "Windows"
               result.os.version, // e.g. "17.0", "11"
               result.browser.name, // e.g. "Chrome", "Safari"
            ].filter(Boolean);

            const deviceName =
               parts.length > 0 ? parts.join(" ") : "Unknown Device";

            console.log(deviceName);

            firebase
               .registerDevice(
                  deviceName,
                  localStorage.getItem("token") || "n/a",
                  token,
               )
               .then(console.log);
         })
         .catch(console.error);
   }, [isAuthenticated]);

   if (!backendAvailable) {
      return (
         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <img
               src="https://i.pinimg.com/736x/45/e6/bc/45e6bcaf0dcbe2302ab4b749b19b4354.jpg"
               alt="fumo"
               className="h-28 w-28 animate-spin object-contain select-none"
               style={{ animationDuration: "3s" }}
            />
            <div className="flex flex-col items-center gap-2 text-center">
               <p className="text-sm font-medium">
                  Không thể kết nối đến máy chủ
               </p>
               <p className="text-xs text-muted-foreground">
                  Vui lòng thử lại sau.
               </p>
            </div>
         </div>
      );
   }

   if (authState == false || userSettings == undefined) {
      console.log(userSettings == undefined, "cai j day");
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      );
   }

   if (!isAuthenticated) return <LoginForm />;

   return (
      <div className="min-h-screen bg-background">
         <DashboardHeader />
         <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <DevicesGrid />
         </main>
      </div>
   );
}
