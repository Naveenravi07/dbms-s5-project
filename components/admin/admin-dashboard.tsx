"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DoctorsManagement } from "@/components/admin/doctors-management"
import { AppointmentsManagement } from "@/components/admin/appointments-management"
import { UsersManagement } from "@/components/admin/users-management"
import { AdminOverview } from "@/components/admin/admin-overview"

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/check", {
        credentials: "include",
      })
      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Admin auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsAuthenticated(false)
      setActiveTab("overview")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminLogin onLogin={handleLogin} />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />
      case "doctors":
        return <DoctorsManagement />
      case "appointments":
        return <AppointmentsManagement />
      case "users":
        return <UsersManagement />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
