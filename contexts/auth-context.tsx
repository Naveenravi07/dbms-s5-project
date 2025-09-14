"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  fname: string
  lname: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  loading: boolean
  backendConnected: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [backendConnected, setBackendConnected] = useState(false)

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Create an AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      // First check if backend is available
      const healthResponse = await fetch("http://localhost:5000/api/health", {
        credentials: "include",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (healthResponse.ok) {
        setBackendConnected(true)

        // Then check auth status
        try {
          const response = await fetch("http://localhost:5000/api/user", {
            credentials: "include",
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          }
        } catch (authError) {
          // Auth check failed, but backend is connected
          console.log("User not authenticated")
        }
      } else {
        setBackendConnected(false)
      }
    } catch (error) {
      // Handle network errors, timeouts, etc.
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Backend connection timeout")
        } else {
          console.log("Backend not available:", error.message)
        }
      }
      setBackendConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    setBackendConnected(true) // Assume backend is connected if login succeeds
  }

  const logout = async () => {
    try {
      if (backendConnected) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        await fetch("http://localhost:5000/api/logout", {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
      }
    } catch (error) {
      // Logout failed, but we'll clear the user anyway
      console.log("Logout request failed, clearing user session")
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, backendConnected }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
