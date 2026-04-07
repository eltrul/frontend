"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DeviceList } from "@/components/device-list"

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
    <DashboardLayout>
      <DeviceList />
    </DashboardLayout>
  )
}
