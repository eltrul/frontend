"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Users } from "@/lib/core/users/users";

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = React.useState(false);

   React.useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return (
         <Button variant="ghost" size="icon" className="h-9 w-9">
            <Sun className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
         </Button>
      );
   }

   async function updateTheme() {
      let curTheme = theme === "dark" ? "light" : "dark";

      setTheme(curTheme);
      new Users().setUserSettings({
         theme: curTheme,
      });
   }

   return (
      <Button
         variant="ghost"
         size="icon"
         className="h-9 w-9"
         onClick={updateTheme}
      >
         {theme === "dark" ? (
            <Sun className="h-4 w-4" />
         ) : (
            <Moon className="h-4 w-4" />
         )}
         <span className="sr-only">Toggle theme</span>
      </Button>
   );
}
