export interface Device {
   deviceId: string;
   deviceName: string;
   latestRecord: number;
   latestRecordSendDate: number;
}
export function formatLastSeen(date: number): string {
   if (date === -1) return "Never";

   const now = new Date();
   const diff = now.getTime() - date * 1000;
   console.log(diff);
   const minutes = Math.floor(diff / (1000 * 60));
   const hours = Math.floor(diff / (1000 * 60 * 60));
   const days = Math.floor(diff / (1000 * 60 * 60 * 24));

   if (minutes < 1) return "Mới vừa đây";
   if (minutes < 60) return `${minutes} phút trước`;
   if (hours < 24) return `${hours} giờ trước`;
   return `${days} ngày trước`;
}

export function formatSplashDate(date: number): string {
   return new Date(date * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
   });
}
