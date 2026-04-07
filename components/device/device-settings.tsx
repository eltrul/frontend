"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Droplets, Save, Settings } from "lucide-react"

interface DeviceSettingsProps {
  initialSprayMode: "humidity" | "time"
  initialTimeInterval: number
  initialHumidityThreshold: number
}

export function DeviceSettings({
  initialSprayMode,
  initialTimeInterval,
  initialHumidityThreshold,
}: DeviceSettingsProps) {
  const [sprayMode, setSprayMode] = useState<"humidity" | "time">(initialSprayMode)
  const [timeInterval, setTimeInterval] = useState(initialTimeInterval)
  const [humidityThreshold, setHumidityThreshold] = useState(initialHumidityThreshold)
  const [hasChanges, setHasChanges] = useState(false)

  const handleModeChange = (isTimeMode: boolean) => {
    setSprayMode(isTimeMode ? "time" : "humidity")
    setHasChanges(true)
  }

  const handleTimeChange = (value: number[]) => {
    setTimeInterval(value[0])
    setHasChanges(true)
  }

  const handleHumidityChange = (value: number[]) => {
    setHumidityThreshold(value[0])
    setHasChanges(true)
  }

  const handleSave = () => {
    // In a real app, this would save to an API
    setHasChanges(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Spray Settings
            </CardTitle>
            <CardDescription>Configure how your device operates</CardDescription>
          </div>
          <Badge variant={sprayMode === "humidity" ? "default" : "secondary"}>
            {sprayMode === "humidity" ? (
              <>
                <Droplets className="mr-1 h-3 w-3" />
                Humidity Mode
              </>
            ) : (
              <>
                <Clock className="mr-1 h-3 w-3" />
                Timer Mode
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
              Spray Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              {sprayMode === "humidity"
                ? "Spray when humidity drops below threshold"
                : "Spray at fixed time intervals"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${sprayMode === "humidity" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Humidity
            </span>
            <Switch
              id="spray-mode"
              checked={sprayMode === "time"}
              onCheckedChange={handleModeChange}
            />
            <span className={`text-sm ${sprayMode === "time" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Timer
            </span>
          </div>
        </div>

        {/* Time Interval Slider - shown when in time mode */}
        {sprayMode === "time" && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Spray Interval</Label>
              <span className="text-lg font-bold text-primary">
                {timeInterval} min
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
              <span>5 min</span>
              <span>30 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
        )}

        {/* Humidity Threshold Slider - shown when in humidity mode */}
        {sprayMode === "humidity" && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Humidity Threshold</Label>
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
              Device will spray when humidity drops below {humidityThreshold}%
            </p>
          </div>
        )}

        {/* Save Button */}
        {hasChanges && (
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
