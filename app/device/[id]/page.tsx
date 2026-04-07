"use client"

import { use, useEffect } from "react"
import { useRouter, notFound } from "next/navigation"
import Link from "next/link"
import { getDeviceById } from "@/lib/devices-data"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { HumidityCard } from "@/components/device/humidity-card"
import { SplashCard } from "@/components/device/splash-card"
import { HumidityChart } from "@/components/device/humidity-chart"
import { DeviceSettings } from "@/components/device/device-settings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wifi, WifiOff, Droplets, Sparkles } from "lucide-react"

export default function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const device = getDeviceById(id)

  useEffect(() => {
    if (user && !user.emailVerified) {
      router.push("/verify")
    }
  }, [user, router])

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (!device) {
    notFound()
  }

  const isOnline = device.status === "online"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button & Device Header */}
        <div className="space-y-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Devices
            </Button>
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Droplets className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
                <p className="text-sm text-muted-foreground">Device ID: {device.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Spray Now
              </Button>
              <Badge 
                variant={isOnline ? "default" : "secondary"}
                className={`${isOnline ? "bg-emerald-500 hover:bg-emerald-500/90 text-white" : ""} text-sm py-1.5 px-3`}
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
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <HumidityCard humidity={device.humidity} />
          <SplashCard latestSplashDate={device.latestSplashDate} />
        </div>

        {/* Chart */}
        <HumidityChart data={device.humidityHistory} />

        {/* Settings */}
        <DeviceSettings
          initialSprayMode={device.sprayMode}
          initialTimeInterval={device.sprayTimeInterval}
          initialHumidityThreshold={device.humidityThreshold}
        />
      </div>
    </DashboardLayout>
  )
}
