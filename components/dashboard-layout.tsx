"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { AppearanceDialog } from "@/components/appearance-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        onOpenAppearance={() => setAppearanceOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      {/* Main content area - offset for sidebar */}
      <div className="pl-16 transition-all duration-300 lg:pl-64">
        <DashboardTopbar />
        <main className="p-6">{children}</main>
      </div>

      {/* Dialogs */}
      <AppearanceDialog open={appearanceOpen} onOpenChange={setAppearanceOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
