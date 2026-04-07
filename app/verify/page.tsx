"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Droplets, Loader2, Mail, ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""))
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { user, pendingEmail, verifyOtp, resendOtp, logout } = useAuth()
  const router = useRouter()

  // Redirect if no pending verification
  useEffect(() => {
    if (!user || user.emailVerified) {
      router.push("/")
    }
  }, [user, router])

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    const sanitized = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    
    if (sanitized.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = sanitized
      setOtp(newOtp)
      setError("")

      // Move to next input if value entered
      if (sanitized && index < 7) {
        inputRefs.current[index + 1]?.focus()
      }
    } else if (sanitized.length > 1) {
      // Handle paste
      const chars = sanitized.slice(0, 8 - index).split("")
      const newOtp = [...otp]
      chars.forEach((char, i) => {
        if (index + i < 8) {
          newOtp[index + i] = char
        }
      })
      setOtp(newOtp)
      setError("")
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(index + chars.length, 7)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    if (pastedData) {
      const chars = pastedData.slice(0, 8).split("")
      const newOtp = Array(8).fill("")
      chars.forEach((char, i) => {
        newOtp[i] = char
      })
      setOtp(newOtp)
      setError("")
      inputRefs.current[Math.min(chars.length, 7)]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length !== 8) {
      setError("Please enter the complete 8-character code")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const success = await verifyOtp(code)
      if (!success) {
        setError("Invalid verification code. Please try again.")
        setOtp(Array(8).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendOtp()
      setResendCooldown(60)
      setOtp(Array(8).fill(""))
      inputRefs.current[0]?.focus()
    } finally {
      setIsResending(false)
    }
  }

  const handleBack = () => {
    logout()
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="mt-2">
              {"We've sent an 8-character verification code to"}
              <br />
              <span className="font-medium text-foreground">{pendingEmail}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Enter the verification code
            </p>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-10 text-center text-lg font-semibold uppercase"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || otp.join("").length !== 8}
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="space-y-3">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {"Didn't receive the code? "}
              </span>
              <Button
                variant="link"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="h-auto p-0 text-sm"
              >
                {isResending ? (
                  "Sending..."
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend code"
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Droplets className="h-4 w-4 text-primary" />
              <span>
                For demo purposes, check the browser console for the OTP code
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
