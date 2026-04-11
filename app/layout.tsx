import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Hệ Thống Tưới Tiêu Tự Động",
   description: "Xin chào mọi người :D:D",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className="font-sans antialiased">
            <Toaster />
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
               <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
            {process.env.NODE_ENV === "production" && <Analytics />}
         </body>
      </html>
   );
}
