"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // 👈 useSearchParams, not useParams
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Droplets, Loader2 } from "lucide-react";
import { Authentication } from "@/lib/core/authentication/authentication";
import { toast } from "sonner";

function DiscordIcon({ className }: { className?: string }) {
   return (
      <svg
         className={className}
         viewBox="0 0 24 24"
         fill="currentColor"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
   );
}

export function LoginForm() {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const searchParams = useSearchParams();
   const code = searchParams.get("code");
   const authentication = new Authentication();
   const hasCalledRef = useRef(false);

   useEffect(() => {
      if (code && localStorage.getItem("s") != "1" && !hasCalledRef.current) {
         hasCalledRef.current = true;
         console.log("CALL CALL");
         setIsLoading(true);
         (async () => {
            (async () => {
               let authResult = await authentication.signIn(code);
               if (!authResult || authResult.errors) {
                  toast.error("Lỗi khi đăng nhập, vui lòng thử lại.");
                  setIsLoading(false);
                  return;
               }
               console.log(authResult);
               if (
                  !authResult.data ||
                  !authResult.data[0].data ||
                  !authResult.data[0].data.userData
               ) {
                  toast.error("Lỗi khi đăng nhập, vui lòng thử lại.");
                  setIsLoading(false);
                  return;
               }

               if (authResult.data) {
                  let userData = authResult.data[0].data.userData;
                  localStorage.setItem(
                     "userData",
                     JSON.stringify(authResult.data[0].data.userData),
                  );
                  localStorage.setItem(
                     "token",
                     authResult.data[0].data.grantToken,
                  );

                  localStorage.setItem(
                     "settingsObjectId",
                     userData.configurationObjectId,
                  );

                  localStorage.setItem("s", "1");

                  toast.success("Đã đăng nhập bằng " + userData.username);
                  setTimeout(() => {
                     if (!userData.emailVerificationPassed) {
                        window.location.href = "/verify";
                        return;
                     }
                     console.log(
                        "email is verified so redirect to landing page",
                     );
                     window.location.href = "/";
                  }, 5000);
               }
            })();
         })();
      }
   }, [code]);

   const handleDiscordLogin = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      router.push(
         "https://discord.com/oauth2/authorize?client_id=1478372368492531743&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=identify+email",
      );
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-4 text-center">
               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Droplets className="h-7 w-7 text-primary" />
               </div>
               <div>
                  <CardTitle className="text-2xl font-bold">
                     Đăng Nhập
                  </CardTitle>
                  <CardDescription className="mt-2">
                     Đăng nhập để tiếp tục
                  </CardDescription>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button
                  onClick={handleDiscordLogin}
                  disabled={isLoading}
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                  size="lg"
               >
                  {isLoading ? (
                     <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang kết nối...
                     </>
                  ) : (
                     <>
                        <DiscordIcon className="mr-2 h-5 w-5" />
                        Đăng nhập với Discord
                     </>
                  )}
               </Button>
               <p className="text-center text-xs text-muted-foreground">
                  Bằng việc tiếp tục, bạn đồng ý với Điều Khoản Dịch Vụ và Chính
                  Sách Quyền Riêng Tư của chúng tôi
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
