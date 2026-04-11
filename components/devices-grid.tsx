"use client";
import { DeviceCard } from "@/components/device-card";
import { useEffect, useState } from "react";
import { Devices } from "@/lib/core/devices/devices";
import { IDeviceConstructor } from "@/lib/typings/devices/IDeviceConstructor";
import { getUnixTimeAtSecond } from "@/lib/utils/timingUtils";
import { CirclePlus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function DevicesGrid() {
   const [devices, setDevices] = useState<IDeviceConstructor[]>([]);
   const [open, setOpen] = useState(false);
   const [deviceName, setDeviceName] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const onlineCount = devices.filter(
      (d) => getUnixTimeAtSecond() - d.latestRecordSendDate < 60 * 5,
   ).length;
   const offlineCount = devices.length - onlineCount;

   const fetchDevices = () => {
      const devicesController = new Devices();
      devicesController
         .getDevices(localStorage.getItem("token") || "")
         .then((response) => {
            setDevices(response.data[0].data);
         });
   };
   useEffect(() => {
      fetchDevices();

      const interval = setInterval(fetchDevices, 5000);

      return () => clearInterval(interval);
   }, []);

   const addDevice = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!deviceName.trim()) return;
      setIsLoading(true);
      try {
         const devicesController = new Devices();
         await devicesController.createDevice(
            deviceName,
            localStorage.getItem("token") || "",
         );
         setDeviceName("");
         setOpen(false);
         fetchDevices();
      } catch (err) {
         console.error("Lỗi khi tạo thiết bị:", err);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">
                  Thiết bị của tôi
               </h1>
               <p className="text-muted-foreground">
                  Quản lý các thiết bị tưới tiêu
               </p>
            </div>
            <div className="flex gap-3 items-center">
               <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium">
                     {onlineCount} Online
                  </span>
               </div>
               <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <span className="text-sm font-medium">
                     {offlineCount} Offline
                  </span>
               </div>

               {/* Dialog nằm ngoài Button */}
               <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                     <Button
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <CirclePlus className="h-4 w-4" />
                        <span className="text-sm font-medium">
                           Thêm thiết bị
                        </span>
                     </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-sm">
                     {/* form nằm trong DialogContent, bọc cả footer */}
                     <form onSubmit={addDevice}>
                        <DialogHeader>
                           <DialogTitle>Thêm thiết bị mới</DialogTitle>
                           <DialogDescription>
                              Nhập tên cho thiết bị tưới tiêu mới.
                           </DialogDescription>
                        </DialogHeader>

                        <FieldGroup className="py-4">
                           <Field>
                              <Label htmlFor="device-name">Tên thiết bị</Label>
                              <Input
                                 id="device-name"
                                 name="name"
                                 placeholder="Ví dụ: Máy bơm khu A"
                                 value={deviceName}
                                 onChange={(e) => setDeviceName(e.target.value)}
                                 autoFocus
                              />
                           </Field>
                        </FieldGroup>

                        <DialogFooter>
                           <DialogClose asChild>
                              <Button type="button" variant="outline">
                                 Hủy
                              </Button>
                           </DialogClose>
                           <Button
                              type="submit"
                              disabled={!deviceName.trim() || isLoading}
                           >
                              {isLoading && (
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {isLoading ? "Đang thêm..." : "Thêm"}
                           </Button>
                        </DialogFooter>
                     </form>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
               <DeviceCard key={device.deviceId} device={device} />
            ))}
         </div>
      </div>
   );
}
