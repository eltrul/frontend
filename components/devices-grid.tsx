"use client"

import { devices } from "@/lib/devices-data"
import { DeviceCard } from "@/components/device-card"

export function DevicesGrid() {
  const onlineCount = devices.filter((d) => d.status === "online").length
  const offlineCount = devices.filter((d) => d.status === "offline").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your smart spray devices
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-medium">{onlineCount} Online</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="text-sm font-medium">{offlineCount} Offline</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  )
}
