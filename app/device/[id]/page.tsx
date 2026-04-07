"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getDeviceById } from "@/lib/devices-data"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { HumidityCard } from "@/components/device/humidity-card"
import { SplashCard } from "@/components/device/splash-card"
import { HumidityChart } from "@/components/device/humidity-chart"
import { DeviceSettings } from "@/components/device/device-settings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wifi, WifiOff } from "lucide-react"

export default function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthenticated } = useAuth()
  const device = getDeviceById(id)

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (!device) {
    notFound()
  }

  const isOnline = device.status === "online"

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button & Device Header */}
        <div className="mb-8 space-y-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Back to Devices
            </Button>
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
              <p className="text-muted-foreground">Device ID: {device.id}</p>
            </div>
            <Badge 
              variant={isOnline ? "default" : "secondary"}
              className={`${isOnline ? "bg-success text-success-foreground" : ""} text-sm py-1.5 px-3`}
            >
              {isOnline ? (
                <Wifi className="mr-1.5 h-4 w-4" />
              ) : (
                <WifiOff className="mr-1.5 h-4 w-4" />
              )}
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <HumidityCard humidity={device.humidity} />
          <SplashCard latestSplashDate={device.latestSplashDate} />
        </div>

        {/* Chart */}
        <div className="mb-6">
          <HumidityChart data={device.humidityHistory} />
        </div>

        {/* Settings */}
        <DeviceSettings
          initialSprayMode={device.sprayMode}
          initialTimeInterval={device.sprayTimeInterval}
          initialHumidityThreshold={device.humidityThreshold}
        />
      </main>
    </div>
  )
}
