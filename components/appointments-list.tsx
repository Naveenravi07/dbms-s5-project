"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Appointment {
  id: number
  time: string
  completed: boolean
  cancelled: boolean
  doctor_fname: string
  doctor_lname: string
  department: string
  createdAt: string
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        setError("Failed to fetch appointments")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (appointment: Appointment) => {
    if (appointment.cancelled) {
      return <Badge variant="destructive">Cancelled</Badge>
    }
    if (appointment.completed) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
    }
    const appointmentDate = new Date(appointment.time)
    const now = new Date()
    if (appointmentDate < now) {
      return <Badge variant="secondary">Past</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please log in to view your appointments.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
          <p className="text-muted-foreground">You haven't booked any appointments yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {appointments.map((appointment) => {
        const { date, time } = formatDateTime(appointment.time)
        return (
          <Card key={appointment.id} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Dr. {appointment.doctor_fname} {appointment.doctor_lname}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {appointment.department}
                  </CardDescription>
                </div>
                {getStatusBadge(appointment)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center text-foreground">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{time}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
