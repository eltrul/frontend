"use client";
import Link from "next/link";
import { Device, formatLastSeen } from "@/lib/devices-data";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Settings, Wifi, WifiOff } from "lucide-react";
import { getUnixTime } from "date-fns/fp";
import { getUnixTimeAtSecond } from "@/lib/utils/timingUtils";
interface DeviceCardProps {
   device: Device;
}
export function DeviceCard({ device }: DeviceCardProps) {
   const isOnline =
      getUnixTimeAtSecond() - device.latestRecordSendDate < 60 * 5;
   const getHumidityColor = (humidity: number) => {
      if (humidity >= 60) return "text-chart-2";
      if (humidity >= 40) return "text-chart-3";
      return "text-destructive";
   };
   return (
      <Card className="flex flex-col transition-all hover:shadow-lg hover:border-primary/30">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                     <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                     <CardTitle className="text-base font-semibold">
                        {device.deviceName}
                     </CardTitle>
                     <p className="text-xs text-muted-foreground">
                        {device.deviceId}
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                  {device.isTestingDevice && (
                     <Badge
                        variant="outline"
                        className="border-amber-400 text-amber-500 bg-amber-50"
                     >
                        🧪 Thử Nghiệm
                     </Badge>
                  )}
                  <Badge
                     variant={isOnline ? "default" : "secondary"}
                     className={
                        isOnline ? "bg-success text-success-foreground" : ""
                     }
                  >
                     {isOnline ? (
                        <Wifi className="mr-1 h-3 w-3" />
                     ) : (
                        <WifiOff className="mr-1 h-3 w-3" />
                     )}
                     {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
                  </Badge>
               </div>
            </div>
         </CardHeader>
         <CardContent className="flex-1 pb-3">
            <div className="grid grid-cols-2 gap-4">
               <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Độ ẩm</p>
                  <p
                     className={`text-2xl font-bold ${getHumidityColor(device.latestRecord)}`}
                  >
                     {device.latestRecord}%
                  </p>
               </div>
               <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                     Lần cuối hoạt động
                  </p>
                  <p className="text-sm font-medium">
                     {isOnline
                        ? "Đang hoạt động"
                        : formatLastSeen(device.latestRecordSendDate)}
                  </p>
               </div>
            </div>
         </CardContent>
         <CardFooter className="pt-0">
            <Link href={`/device/${device.deviceId}`} className="w-full">
               <Button variant="outline" className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Quản lý
               </Button>
            </Link>
         </CardFooter>
      </Card>
   );
}
