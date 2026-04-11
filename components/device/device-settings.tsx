"use client";

import { useEffect, useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Droplets, Loader2, Save, Settings } from "lucide-react";
import { Devices } from "@/lib/core/devices/devices";
import { IDeviceSettings } from "@/lib/typings/devices/IDeviceSettings";
import { Configuration } from "@/lib/core/configuration/configuration";
import { toast } from "sonner";

interface DeviceSettingsProps {
   deviceId: string;
   configurationObjectId: string;
}

export function DeviceSettings({
   deviceId,
   configurationObjectId,
}: DeviceSettingsProps) {
   const [deviceSettings, setDeviceSettings] = useState<
      IDeviceSettings | undefined
   >();
   const [isFetching, setIsFetching] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);

   // Local editable state — synced from deviceSettings after fetch
   const [sprayMode, setSprayMode] = useState<"humidity" | "timer">("humidity");
   const [timeInterval, setTimeInterval] = useState(30);
   const [humidityThreshold, setHumidityThreshold] = useState(50);

   useEffect(() => {
      const devices = new Devices();
      const configuration = new Configuration();

      (async () => {
         setIsFetching(true);
         try {
            const deviceConfigurationSettingsKey =
               await devices.getDeviceSettingsKey(
                  deviceId,
                  localStorage.getItem("token") || "",
               );
            if (!deviceConfigurationSettingsKey.data[0]) {
               toast.error("Lỗi khi giao tiếp với máy chủ.");
               return;
            }
            const config = await configuration.getConfiguration(
               "humidityPotSettings",
               configurationObjectId,
               deviceConfigurationSettingsKey.data[0].data?.accessKey,
            );
            if (!config.data) {
               toast.error("Lỗi khi giao tiếp với máy chủ.");
               return;
            }
            const settings: IDeviceSettings = config.data[0].data;
            setDeviceSettings(settings);
            console.log("Settings", settings);

            // Sync local state from fetched settings
            setSprayMode(settings.sprayMode ?? "humidity");
            setTimeInterval(settings.sprayInterval ?? 30);
            setHumidityThreshold(settings.sprayThresehold ?? 50);
         } catch {
            toast.error("Lỗi khi tải cấu hình thiết bị.");
         } finally {
            setIsFetching(false);
         }
      })();
   }, [deviceId, configurationObjectId]);

   const handleModeChange = (isTimeMode: boolean) => {
      setSprayMode(isTimeMode ? "timer" : "humidity");
      setHasChanges(true);
   };

   const handleTimeChange = (value: number[]) => {
      setTimeInterval(value[0]);
      setHasChanges(true);
   };

   const handleHumidityChange = (value: number[]) => {
      setHumidityThreshold(value[0]);
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const devices = new Devices();
         const configuration = new Configuration();

         const deviceConfigurationSettingsKey =
            await devices.getDeviceSettingsKey(
               deviceId,
               localStorage.getItem("token") || "",
            );
         if (!deviceConfigurationSettingsKey.data[0]) {
            toast.error("Lỗi khi giao tiếp với máy chủ.");
            return;
         }

         await configuration.setConfigurationCombo(
            "humidityPotSettings",
            configurationObjectId,
            deviceConfigurationSettingsKey.data[0].data?.accessKey,
            {
               sprayMode,
               sprayInterval: timeInterval,
               sprayThresehold: humidityThreshold,
            },
         );

         setHasChanges(false);
         toast.success("Đã lưu cấu hình thành công.");
      } catch {
         toast.error("Lỗi khi lưu cấu hình.");
      } finally {
         setIsSaving(false);
      }
   };

   if (isFetching) {
      return (
         <Card>
            <CardContent className="flex items-center justify-center py-12">
               <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                     <Settings className="h-5 w-5 text-muted-foreground" />
                     Cài đặt phun
                  </CardTitle>
                  <CardDescription>
                     Cấu hình chế độ hoạt động của thiết bị
                  </CardDescription>
               </div>
               <Badge
                  variant={sprayMode === "humidity" ? "default" : "secondary"}
               >
                  {sprayMode === "humidity" ? (
                     <>
                        <Droplets className="mr-1 h-3 w-3" />
                        Chế độ độ ẩm
                     </>
                  ) : (
                     <>
                        <Clock className="mr-1 h-3 w-3" />
                        Chế độ hẹn giờ
                     </>
                  )}
               </Badge>
            </div>
         </CardHeader>

         <CardContent className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
               <div className="space-y-1">
                  <Label htmlFor="spray-mode" className="text-base font-medium">
                     Chế độ phun
                  </Label>
                  <p className="text-sm text-muted-foreground">
                     {sprayMode === "humidity"
                        ? "Phun khi độ ẩm xuống dưới ngưỡng"
                        : "Phun theo khoảng thời gian cố định"}
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <span
                     className={`text-sm ${sprayMode === "humidity" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                     Độ ẩm
                  </span>
                  <Switch
                     id="spray-mode"
                     checked={sprayMode === "timer"}
                     onCheckedChange={handleModeChange}
                  />
                  <span
                     className={`text-sm ${sprayMode === "timer" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                     Hẹn giờ
                  </span>
               </div>
            </div>

            {/* Time Interval Slider */}
            {sprayMode === "timer" && (
               <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                     <Label className="text-base font-medium">
                        Khoảng thời gian phun
                     </Label>
                     <span className="text-lg font-bold text-primary">
                        {Math.floor(timeInterval)} phút
                     </span>
                  </div>
                  <Slider
                     value={[timeInterval]}
                     onValueChange={handleTimeChange}
                     min={5}
                     max={120}
                     step={5}
                     className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                     <span>5 phút</span>
                     <span>30 phút</span>
                     <span>60 phút</span>
                     <span>120 phút</span>
                  </div>
               </div>
            )}

            {/* Humidity Threshold Slider */}
            {sprayMode === "humidity" && (
               <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                     <Label className="text-base font-medium">
                        Ngưỡng độ ẩm
                     </Label>
                     <span className="text-lg font-bold text-primary">
                        {humidityThreshold}%
                     </span>
                  </div>
                  <Slider
                     value={[humidityThreshold]}
                     onValueChange={handleHumidityChange}
                     min={20}
                     max={80}
                     step={5}
                     className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                     <span>20%</span>
                     <span>40%</span>
                     <span>60%</span>
                     <span>80%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                     Thiết bị sẽ phun khi độ ẩm xuống dưới {humidityThreshold}%
                  </p>
               </div>
            )}

            {/* Save Button */}
            {hasChanges && (
               <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full gap-2"
               >
                  {isSaving ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Save className="h-4 w-4" />
                  )}
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
               </Button>
            )}
         </CardContent>
      </Card>
   );
}
