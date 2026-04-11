"use client";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

interface HumidityChartProps {
   data: { date: number; value: number }[];
}

export function HumidityChart({ data }: HumidityChartProps) {
   if (data.length == 1) {
      data.push(data[0]);
   }
   const chartConfig = {
      value: {
         label: "Độ ẩm",
         color: "var(--color-chart-1)",
      },
   };

   const avgHumidity =
      data.length === 0
         ? 0
         : Math.round(
              data.reduce((acc, curr) => acc + curr.value, 0) / data.length,
           );
   const formatDate = (epoch: number) => {
      const date = new Date(epoch * 1000);
      const now = new Date();
      const isToday =
         date.getDate() === now.getDate() &&
         date.getMonth() === now.getMonth() &&
         date.getFullYear() === now.getFullYear();

      if (isToday) {
         return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
         });
      }

      return date.toLocaleDateString("vi-VN", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-muted-foreground" />
                     Lịch sử độ ẩm
                  </CardTitle>
                  <CardDescription>20 lần đo gần nhất</CardDescription>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-bold">{avgHumidity}%</p>
                  <p className="text-xs text-muted-foreground">Trung bình</p>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
               >
                  <defs>
                     <linearGradient
                        id="humidityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                     >
                        <stop
                           offset="5%"
                           stopColor="var(--color-chart-1)"
                           stopOpacity={0.3}
                        />
                        <stop
                           offset="95%"
                           stopColor="var(--color-chart-1)"
                           stopOpacity={0}
                        />
                     </linearGradient>
                  </defs>
                  <CartesianGrid
                     strokeDasharray="3 3"
                     className="stroke-muted"
                  />
                  <XAxis
                     dataKey="date"
                     tickFormatter={formatDate}
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
                           formatter={(value) => ["Độ ẩm ", `${value}%`]}
                           labelFormatter={(label, payload) => {
                              const epoch = payload?.[0]?.payload?.date;
                              return epoch ? formatDate(epoch) : label;
                           }}
                        />
                     }
                  />
                  <Area
                     type="monotone"
                     dataKey="value"
                     stroke="var(--color-chart-1)"
                     strokeWidth={2}
                     fill="url(#humidityGradient)"
                  />
               </AreaChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
