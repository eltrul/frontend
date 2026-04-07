"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AppSettings {
  notifications: boolean
  autoRefresh: boolean
  refreshInterval: string
  temperatureUnit: string
  compactView: boolean
  soundAlerts: boolean
}

const defaultSettings: AppSettings = {
  notifications: true,
  autoRefresh: true,
  refreshInterval: "30",
  temperatureUnit: "celsius",
  compactView: false,
  soundAlerts: false,
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem("app-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("app-settings", JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem("app-settings", JSON.stringify(defaultSettings))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your dashboard preferences and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Notifications</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive alerts when devices go offline
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting("notifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="soundAlerts">Sound Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Play sound for critical notifications
                </p>
              </div>
              <Switch
                id="soundAlerts"
                checked={settings.soundAlerts}
                onCheckedChange={(checked) => updateSetting("soundAlerts", checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Data Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Data & Display</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoRefresh">Auto Refresh</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically update device status
                </p>
              </div>
              <Switch
                id="autoRefresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSetting("autoRefresh", checked)}
              />
            </div>
            {settings.autoRefresh && (
              <div className="flex items-center justify-between">
                <Label htmlFor="refreshInterval">Refresh Interval</Label>
                <Select
                  value={settings.refreshInterval}
                  onValueChange={(value) => updateSetting("refreshInterval", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compactView">Compact View</Label>
                <p className="text-xs text-muted-foreground">
                  Show more devices on screen
                </p>
              </div>
              <Switch
                id="compactView"
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSetting("compactView", checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Units Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Units</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="temperatureUnit">Temperature Unit</Label>
              <Select
                value={settings.temperatureUnit}
                onValueChange={(value) => updateSetting("temperatureUnit", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Reset Section */}
          <div className="flex justify-between">
            <div className="space-y-0.5">
              <Label>Reset Settings</Label>
              <p className="text-xs text-muted-foreground">
                Restore default settings
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetSettings}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
