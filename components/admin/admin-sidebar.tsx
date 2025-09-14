"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Users, Calendar, UserCheck, LogOut, Shield } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "doctors", label: "Doctors", icon: UserCheck },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
  ]

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-16">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <Separator className="my-6" />

        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
