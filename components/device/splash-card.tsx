"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sparkles } from "lucide-react";

interface SplashCardProps {
   latestSplashDate: number;
}

export function SplashCard({ latestSplashDate }: SplashCardProps) {
   if (latestSplashDate === -1) {
      return (
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Lần tưới gần nhất
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                     <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                     <p className="text-lg font-semibold">Chưa tưới</p>
                     <p className="text-sm text-muted-foreground">—</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      );
   }

   const now = new Date();
   const diff = now.getTime() - latestSplashDate * 1000;
   const minutesAgo = Math.floor(diff / (1000 * 60));
   const hoursAgo = Math.floor(diff / (1000 * 60 * 60));
   const daysAgo = Math.floor(diff / (1000 * 60 * 60 * 24));

   const getTimeSinceLabel = () => {
      if (minutesAgo < 1) return "Vừa xong";
      if (minutesAgo < 60) return `${minutesAgo} phút trước`;
      if (hoursAgo < 24) return `${hoursAgo} giờ trước`;
      return `${daysAgo} ngày trước`;
   };

   const formatted = new Date(latestSplashDate * 1000).toLocaleString("vi-VN");

   return (
      <Card>
         <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
               <Sparkles className="h-4 w-4" />
               Lần tưới gần nhất
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex items-center gap-3">
               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <p className="text-lg font-semibold">{getTimeSinceLabel()}</p>
                  <p className="text-sm text-muted-foreground">{formatted}</p>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
