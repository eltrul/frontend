"use client"

import Link from "next/link"
import { devices, Device, formatLastSeen } from "@/lib/devices-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Droplets,
  Settings,
  Wifi,
  WifiOff,
  Clock,
  Gauge,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DeviceItemProps {
  device: Device
  compact?: boolean
}

function DeviceItem({ device, compact }: DeviceItemProps) {
  const isOnline = device.status === "online"
  
  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 60) return { label: "Optimal", color: "text-emerald-500", bg: "bg-emerald-500" }
    if (humidity >= 40) return { label: "Normal", color: "text-amber-500", bg: "bg-amber-500" }
    return { label: "Low", color: "text-rose-500", bg: "bg-rose-500" }
  }

  const humidityStatus = getHumidityStatus(device.humidity)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Status indicator line */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 transition-all",
          isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"
        )}
      />

      <div className="flex items-start gap-4">
        {/* Device Icon */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl transition-colors",
            compact ? "h-12 w-12" : "h-14 w-14",
            isOnline
              ? "bg-gradient-to-br from-primary/20 to-accent/20"
              : "bg-muted"
          )}
        >
          <Droplets
            className={cn(
              compact ? "h-6 w-6" : "h-7 w-7",
              isOnline ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>

        {/* Device Info */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold tracking-tight">{device.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                {isOnline ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5" />
                    <span>Last seen {formatLastSeen(device.lastSeen)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Spray Now
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Quick Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Remove Device
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats */}
          <div className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-3")}>
            {/* Humidity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5" />
                  Humidity
                </span>
                <span className={cn("font-semibold", humidityStatus.color)}>
                  {device.humidity}%
                </span>
              </div>
              <Progress
                value={device.humidity}
                className="h-1.5"
              />
            </div>

            {/* Mode */}
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {device.sprayMode === "humidity" ? (
                  <Droplets className="h-3.5 w-3.5" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
                Mode
              </span>
              <Badge variant="secondary" className="font-normal">
                {device.sprayMode === "humidity"
                  ? `Auto (${device.humidityThreshold}%)`
                  : `Timer (${device.sprayTimeInterval}m)`}
              </Badge>
            </div>

            {/* Action */}
            {!compact && (
              <div className="flex items-end justify-end">
                <Link href={`/device/${device.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary"
                  >
                    Manage
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {compact && (
            <Link href={`/device/${device.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Manage Device
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

interface DeviceListProps {
  compact?: boolean
}

export function DeviceList({ compact }: DeviceListProps) {
  const onlineDevices = devices.filter((d) => d.status === "online")
  const offlineDevices = devices.filter((d) => d.status === "offline")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and control your smart spray devices
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {onlineDevices.length} Online
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <span className="text-sm font-medium text-muted-foreground">
              {offlineDevices.length} Offline
            </span>
          </div>
        </div>
      </div>

      {/* Online Devices */}
      {onlineDevices.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <Wifi className="h-4 w-4" />
            Active Devices
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {onlineDevices.map((device) => (
              <DeviceItem key={device.id} device={device} compact={compact} />
            ))}
          </div>
        </div>
      )}

      {/* Offline Devices */}
      {offlineDevices.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <WifiOff className="h-4 w-4" />
            Offline Devices
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {offlineDevices.map((device) => (
              <DeviceItem key={device.id} device={device} compact={compact} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
