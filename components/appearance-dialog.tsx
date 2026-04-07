"use client"

import { useTheme } from "next-themes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun, Check } from "lucide-react"
import { useEffect, useState } from "react"

interface AppearanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const colorPalettes = [
  { name: "Blue", primary: "oklch(0.6 0.22 250)", accent: "oklch(0.7 0.18 180)" },
  { name: "Emerald", primary: "oklch(0.65 0.2 160)", accent: "oklch(0.7 0.18 145)" },
  { name: "Rose", primary: "oklch(0.65 0.22 10)", accent: "oklch(0.7 0.18 25)" },
  { name: "Orange", primary: "oklch(0.7 0.2 50)", accent: "oklch(0.75 0.18 70)" },
  { name: "Violet", primary: "oklch(0.6 0.22 290)", accent: "oklch(0.7 0.18 310)" },
  { name: "Cyan", primary: "oklch(0.7 0.18 200)", accent: "oklch(0.75 0.15 190)" },
]

export function AppearanceDialog({ open, onOpenChange }: AppearanceDialogProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState("Blue")

  useEffect(() => {
    setMounted(true)
    // Load saved palette
    const saved = localStorage.getItem("color-palette")
    if (saved) setSelectedPalette(saved)
  }, [])

  const handlePaletteChange = (paletteName: string) => {
    setSelectedPalette(paletteName)
    localStorage.setItem("color-palette", paletteName)
    
    const palette = colorPalettes.find(p => p.name === paletteName)
    if (palette) {
      document.documentElement.style.setProperty("--primary", palette.primary)
      document.documentElement.style.setProperty("--accent", palette.accent)
      document.documentElement.style.setProperty("--ring", palette.primary)
      document.documentElement.style.setProperty("--sidebar-primary", palette.primary)
      document.documentElement.style.setProperty("--chart-1", palette.primary)
      document.documentElement.style.setProperty("--chart-2", palette.accent)
    }
  }

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
          <DialogDescription>
            Customize how the dashboard looks on your device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-3"
            >
              {themeOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                    theme === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="sr-only"
                  />
                  <option.icon
                    className={cn(
                      "h-6 w-6",
                      theme === option.value ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      theme === option.value ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Color Palette Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Palette</Label>
            <div className="grid grid-cols-3 gap-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => handlePaletteChange(palette.name)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                    selectedPalette === palette.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex gap-1">
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </div>
                  <span className="text-xs font-medium">{palette.name}</span>
                  {selectedPalette === palette.name && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
