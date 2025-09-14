"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Server } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, backendConnected } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!backendConnected) {
      setError("Backend server is not running. Please start the Flask server at localhost:5000")
      return
    }

    setLoading(true)
    setError("")

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({ email, password }),
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (response.ok) {
        login(data.user)
        router.push("/doctors")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Request timeout. Please check if the backend server is running.")
        } else {
          setError("Network error. Please ensure the backend server is running at localhost:5000")
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!backendConnected && (
        <Alert>
          <Server className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Server Required</strong>
            <br />
            Please start the Flask backend server to enable login functionality.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={!backendConnected}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            disabled={!backendConnected}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !backendConnected}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {!backendConnected && (
        <div className="text-sm text-muted-foreground text-center">
          Demo credentials: admin@hospital.com / admin123 (when backend is running)
        </div>
      )}
    </form>
  )
}
