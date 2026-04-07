"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

interface HumidityChartProps {
  data: { date: string; humidity: number }[]
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartConfig = {
    humidity: {
      label: "Humidity",
      color: "var(--color-chart-1)",
    },
  }

  const avgHumidity = Math.round(
    data.reduce((acc, curr) => acc + curr.humidity, 0) / data.length
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Humidity History
            </CardTitle>
            <CardDescription>Last 7 days humidity readings</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{avgHumidity}%</p>
            <p className="text-xs text-muted-foreground">Avg humidity</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}%`, "Humidity"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#humidityGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
