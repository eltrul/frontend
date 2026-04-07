"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatSplashDate } from "@/lib/devices-data"
import { Clock, Sparkles } from "lucide-react"

interface SplashCardProps {
  latestSplashDate: Date
}

export function SplashCard({ latestSplashDate }: SplashCardProps) {
  const now = new Date()
  const diff = now.getTime() - latestSplashDate.getTime()
  const minutesAgo = Math.floor(diff / (1000 * 60))
  const hoursAgo = Math.floor(diff / (1000 * 60 * 60))

  const getTimeSinceLabel = () => {
    if (minutesAgo < 1) return "Just now"
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`
    if (hoursAgo < 24) return `${hoursAgo} hours ago`
    return formatSplashDate(latestSplashDate)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Latest Splash
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">{getTimeSinceLabel()}</p>
            <p className="text-sm text-muted-foreground">
              {formatSplashDate(latestSplashDate)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
