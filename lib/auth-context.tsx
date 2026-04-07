"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  name: string
  avatar?: string
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  pendingEmail: string | null
  loginWithDiscord: () => Promise<void>
  verifyOtp: (code: string) => Promise<boolean>
  resendOtp: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Generate random 8-character alphanumeric OTP
function generateOtp(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let otp = ""
  for (let i = 0; i < 8; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return otp
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [currentOtp, setCurrentOtp] = useState<string | null>(null)
  const router = useRouter()

  const loginWithDiscord = async (): Promise<void> => {
    // Simulated Discord OAuth - in production, this would redirect to Discord
    // For demo purposes, we simulate a successful Discord login
    const mockDiscordUser = {
      email: "user@discord.example.com",
      name: "DiscordUser",
      avatar: undefined,
    }
    
    // Generate OTP and set pending verification
    const otp = generateOtp()
    setCurrentOtp(otp)
    setPendingEmail(mockDiscordUser.email)
    
    // In production, this would send an email with the OTP
    // For demo, we'll show it in the console
    console.log("[v0] OTP Code for verification:", otp)
    
    // Store user data temporarily
    setUser({
      ...mockDiscordUser,
      emailVerified: false,
    })
    
    // Redirect to verification page
    router.push("/verify")
  }

  const verifyOtp = async (code: string): Promise<boolean> => {
    // Check if the provided code matches (case-insensitive)
    if (currentOtp && code.toUpperCase() === currentOtp.toUpperCase()) {
      setUser((prev) => prev ? { ...prev, emailVerified: true } : null)
      setPendingEmail(null)
      setCurrentOtp(null)
      router.push("/")
      return true
    }
    return false
  }

  const resendOtp = async (): Promise<void> => {
    const otp = generateOtp()
    setCurrentOtp(otp)
    // In production, this would send a new email
    console.log("[v0] New OTP Code:", otp)
  }

  const logout = () => {
    setUser(null)
    setPendingEmail(null)
    setCurrentOtp(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.emailVerified,
        pendingEmail,
        loginWithDiscord,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
