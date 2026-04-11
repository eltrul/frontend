"use client";

import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Droplets, LogOut, User } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
   const { user, logout } = useAuth();

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Droplets className="h-5 w-5 text-primary-foreground" />
               </div>
               <span className="text-lg font-semibold">Tưới Tiêu Tự Động</span>
            </Link>

            <div className="flex items-center gap-2">
               <ThemeToggle />

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full"
                     >
                        <Avatar className="h-9 w-9">
                           <AvatarImage
                              src={user?.avatar}
                              alt={"@" + user?.username}
                           />
                           <AvatarFallback className="bg-primary/10 text-primary">
                              {user?.username?.charAt(0).toUpperCase() || "U"}
                           </AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center space-x-3">
                           <Avatar className="h-8 w-8">
                              <AvatarImage
                                 src={user?.avatar}
                                 alt={"@" + user?.username}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                 {user?.username?.charAt(0).toUpperCase() ||
                                    "U"}
                              </AvatarFallback>
                           </Avatar>

                           <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium">
                                 {user?.displayName} ({user?.username})
                              </p>
                              <p className="text-xs text-muted-foreground">
                                 {user?.email}
                              </p>
                           </div>
                        </div>
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={logout}
                        className="text-destructive focus:text-destructive"
                     >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </header>
   );
}
