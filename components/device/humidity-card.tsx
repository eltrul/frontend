"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";

interface HumidityCardProps {
   humidity: number;
}

export function HumidityCard({ humidity }: HumidityCardProps) {
   const getHumidityStatus = (value: number) => {
      if (value >= 70) return { label: "Cao", color: "text-chart-2" };
      if (value >= 50) return { label: "Bình thường", color: "text-success" };
      if (value >= 30) return { label: "Thấp", color: "text-warning" };
      return { label: "Very Low", color: "text-destructive" };
   };

   const status = getHumidityStatus(humidity);

   return (
      <Card>
         <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
               <Droplets className="h-4 w-4" />
               Độ ẩm
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex items-baseline gap-2">
               <span className={`text-4xl font-bold ${status.color}`}>
                  {humidity}%
               </span>
               <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
               </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
               <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${humidity}%` }}
               />
            </div>
         </CardContent>
      </Card>
   );
}
