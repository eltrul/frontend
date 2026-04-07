"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { DevicesGrid } from "@/components/devices-grid"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect to verify page if user exists but email not verified
  useEffect(() => {
    if (user && !user.emailVerified) {
      router.push("/verify")
    }
  }, [user, router])

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DevicesGrid />
      </main>
    </div>
  )
}
