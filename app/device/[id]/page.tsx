"use client";

import { useEffect, useState, useCallback } from "react";  // ← thêm useCallback
import { notFound } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { DashboardHeader } from "@/components/dashboard-header";
import { HumidityCard } from "@/components/device/humidity-card";
import { SplashCard } from "@/components/device/splash-card";
import { HumidityChart } from "@/components/device/humidity-chart";
import { DeviceSettings } from "@/components/device/device-settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { type IDeviceConstructor } from "@/lib/typings/devices/IDeviceConstructor";
import { IUserSettings } from "@/lib/typings/users/IUserSettings";
import { useTheme } from "next-themes";
import { isBackendAvailable } from "@/lib/core";
import { Users as UsersClass } from "@/lib/core/users/users";
import { Devices } from "@/lib/core/devices/devices";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function DevicePage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = use(params);
   const { isAuthenticated, user, authState } = useAuth();
   const router = useRouter();
   const [backendAvailable, setBackendAvailableState] = useState<boolean>(true);
   const [userSettings, setUserSettings] = useState<IUserSettings | undefined | false>(undefined);
   const [device, setDevice] = useState<IDeviceConstructor | null | undefined>(undefined);
   const { setTheme } = useTheme();

   // ← XÓA useEffect cũ (IIFE), chỉ giữ cái này
   const fetchDeviceData = useCallback(async (isInitial = false) => {
      const available = await isBackendAvailable();
      if (!available) {
         setBackendAvailableState(false);
         return;
      }

      const token = localStorage.getItem("token") || "";

      if (isInitial) {
         const userSettingsRes = await new UsersClass().getUserSettings();
         if (!userSettingsRes) {
            localStorage.clear();
            setUserSettings(false);
            return;
         }
         setUserSettings(userSettingsRes[0].data);
         setTheme(userSettingsRes[0].data.theme);
      }

      const deviceRes = await new Devices().getDeviceMetadata(id, token);
      console.log(deviceRes);
      if (!deviceRes) {
         setBackendAvailableState(false);
         return;
      }
      setDevice(deviceRes);
   }, [id]);

   useEffect(() => {
      fetchDeviceData(true);
      const interval = setInterval(() => fetchDeviceData(false), 5000);
      return () => clearInterval(interval);
   }, [fetchDeviceData]);

   const isOnline = (new Date().getTime() / 1000) - device?.latestRecordSendDate < (60 * 5) ;

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
               <p className="text-sm font-medium">Không thể kết nối đến máy chủ</p>
               <p className="text-xs text-muted-foreground">Vui lòng thử lại sau.</p>
            </div>
         </div>
      );
   }

   if (authState === false || userSettings === undefined || device === undefined) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      );
   }

   if (!isAuthenticated) return <LoginForm />;
   if (device === null) notFound();

   // ← XÓA setTimeout ở đây

   return (
      <div className="min-h-screen bg-background">
         <DashboardHeader />
         <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-4">
               <Link href="/">
                  <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                     <ArrowLeft className="h-4 w-4" />
                     Quay lại
                  </Button>
               </Link>
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                     <h1 className="text-2xl font-bold tracking-tight">{device.deviceName}</h1>
                     <p className="text-muted-foreground">{device.deviceId}</p>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                     {device.isTestingDevice && (
                        <Badge
                           variant="outline"
                           className="border-amber-400 text-amber-500 bg-amber-50 text-sm py-1.5 px-3"
                        >
                           🧪 Thử Nghiệm
                        </Badge>
                     )}
                     <Badge
                        variant={isOnline ? "default" : "secondary"}
                        className={`${isOnline ? "bg-success text-success-foreground" : ""} text-sm py-1.5 px-3`}
                     >
                        {isOnline ? <Wifi className="mr-1.5 h-4 w-4" /> : <WifiOff className="mr-1.5 h-4 w-4" />}
                        {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                     </Badge>
                  </div>
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
               <HumidityCard humidity={device.latestRecord} />
               <SplashCard latestSplashDate={device.latestSprayDate} />
            </div>

            <div className="mb-6">
               <HumidityChart data={device.humidityHistory} />
            </div>

            <DeviceSettings
               deviceId={device.deviceId}
               configurationObjectId={device.configurationObjectId}
            />
         </main>
      </div>
   );
}
