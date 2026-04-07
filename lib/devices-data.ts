export interface Device {
  id: string
  name: string
  status: "online" | "offline"
  lastSeen: Date
  humidity: number
  latestSplashDate: Date
  sprayMode: "humidity" | "time"
  sprayTimeInterval: number // in minutes
  humidityThreshold: number
  humidityHistory: { date: string; humidity: number }[]
}

export const devices: Device[] = [
  {
    id: "1",
    name: "Living Room Mister",
    status: "online",
    lastSeen: new Date(),
    humidity: 65,
    latestSplashDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sprayMode: "humidity",
    sprayTimeInterval: 30,
    humidityThreshold: 60,
    humidityHistory: [
      { date: "Mon", humidity: 58 },
      { date: "Tue", humidity: 62 },
      { date: "Wed", humidity: 55 },
      { date: "Thu", humidity: 68 },
      { date: "Fri", humidity: 72 },
      { date: "Sat", humidity: 65 },
      { date: "Sun", humidity: 65 },
    ],
  },
  {
    id: "2",
    name: "Greenhouse Sprayer",
    status: "online",
    lastSeen: new Date(),
    humidity: 78,
    latestSplashDate: new Date(Date.now() - 30 * 60 * 1000),
    sprayMode: "time",
    sprayTimeInterval: 15,
    humidityThreshold: 70,
    humidityHistory: [
      { date: "Mon", humidity: 75 },
      { date: "Tue", humidity: 78 },
      { date: "Wed", humidity: 82 },
      { date: "Thu", humidity: 76 },
      { date: "Fri", humidity: 80 },
      { date: "Sat", humidity: 77 },
      { date: "Sun", humidity: 78 },
    ],
  },
  {
    id: "3",
    name: "Garden Irrigation",
    status: "offline",
    lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    humidity: 42,
    latestSplashDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    sprayMode: "humidity",
    sprayTimeInterval: 60,
    humidityThreshold: 50,
    humidityHistory: [
      { date: "Mon", humidity: 55 },
      { date: "Tue", humidity: 48 },
      { date: "Wed", humidity: 45 },
      { date: "Thu", humidity: 42 },
      { date: "Fri", humidity: 42 },
      { date: "Sat", humidity: 42 },
      { date: "Sun", humidity: 42 },
    ],
  },
  {
    id: "4",
    name: "Bedroom Humidifier",
    status: "online",
    lastSeen: new Date(),
    humidity: 52,
    latestSplashDate: new Date(Date.now() - 45 * 60 * 1000),
    sprayMode: "time",
    sprayTimeInterval: 45,
    humidityThreshold: 55,
    humidityHistory: [
      { date: "Mon", humidity: 48 },
      { date: "Tue", humidity: 50 },
      { date: "Wed", humidity: 53 },
      { date: "Thu", humidity: 55 },
      { date: "Fri", humidity: 51 },
      { date: "Sat", humidity: 49 },
      { date: "Sun", humidity: 52 },
    ],
  },
  {
    id: "5",
    name: "Office Plant Mister",
    status: "offline",
    lastSeen: new Date(Date.now() - 12 * 60 * 60 * 1000),
    humidity: 38,
    latestSplashDate: new Date(Date.now() - 14 * 60 * 60 * 1000),
    sprayMode: "humidity",
    sprayTimeInterval: 20,
    humidityThreshold: 45,
    humidityHistory: [
      { date: "Mon", humidity: 45 },
      { date: "Tue", humidity: 42 },
      { date: "Wed", humidity: 40 },
      { date: "Thu", humidity: 38 },
      { date: "Fri", humidity: 38 },
      { date: "Sat", humidity: 38 },
      { date: "Sun", humidity: 38 },
    ],
  },
  {
    id: "6",
    name: "Patio Cooling System",
    status: "online",
    lastSeen: new Date(),
    humidity: 45,
    latestSplashDate: new Date(Date.now() - 10 * 60 * 1000),
    sprayMode: "time",
    sprayTimeInterval: 10,
    humidityThreshold: 40,
    humidityHistory: [
      { date: "Mon", humidity: 42 },
      { date: "Tue", humidity: 44 },
      { date: "Wed", humidity: 46 },
      { date: "Thu", humidity: 43 },
      { date: "Fri", humidity: 45 },
      { date: "Sat", humidity: 47 },
      { date: "Sun", humidity: 45 },
    ],
  },
]

export function getDeviceById(id: string): Device | undefined {
  return devices.find((device) => device.id === id)
}

export function formatLastSeen(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function formatSplashDate(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
