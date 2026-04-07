"use client"

import Link from "next/link"
import { Device, formatLastSeen } from "@/lib/devices-data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Settings, Wifi, WifiOff } from "lucide-react"

interface DeviceCardProps {
  device: Device
}

export function DeviceCard({ device }: DeviceCardProps) {
  const isOnline = device.status === "online"
  
  const getHumidityColor = (humidity: number) => {
    if (humidity >= 60) return "text-chart-2"
    if (humidity >= 40) return "text-chart-3"
    return "text-destructive"
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{device.name}</CardTitle>
              <p className="text-xs text-muted-foreground">ID: {device.id}</p>
            </div>
          </div>
          <Badge 
            variant={isOnline ? "default" : "secondary"}
            className={isOnline ? "bg-success text-success-foreground" : ""}
          >
            {isOnline ? (
              <Wifi className="mr-1 h-3 w-3" />
            ) : (
              <WifiOff className="mr-1 h-3 w-3" />
            )}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className={`text-2xl font-bold ${getHumidityColor(device.humidity)}`}>
              {device.humidity}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Last Seen</p>
            <p className="text-sm font-medium">
              {isOnline ? "Now" : formatLastSeen(device.lastSeen)}
            </p>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {device.sprayMode === "humidity" ? "Humidity Mode" : "Timer Mode"}
          </Badge>
          {device.sprayMode === "time" && (
            <Badge variant="outline" className="text-xs">
              Every {device.sprayTimeInterval}m
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link href={`/device/${device.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
