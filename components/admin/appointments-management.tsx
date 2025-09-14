"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface Appointment {
  id: number
  time: string
  completed: boolean
  cancelled: boolean
  patient_fname: string
  patient_lname: string
  patient_email: string
  doctor_fname: string
  doctor_lname: string
  department: string
  createdAt: string
}

export function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

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

  const updateAppointmentStatus = async (appointmentId: number, completed: boolean, cancelled: boolean) => {
    setUpdatingId(appointmentId)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ completed, cancelled }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Appointment status updated successfully")
        fetchAppointments()
      } else {
        setError(data.error || "Failed to update appointment")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setUpdatingId(null)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Appointments Management</h1>
          <p className="text-muted-foreground">Manage patient appointments and schedules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20" />
                  <div className="h-8 bg-muted rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointments Management</h1>
        <p className="text-muted-foreground">Manage patient appointments and schedules</p>
      </div>

      {(error || success) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertDescription>{error || success}</AlertDescription>
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
            <p className="text-muted-foreground">Appointments will appear here once patients start booking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.time)
            return (
              <Card key={appointment.id} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        {appointment.patient_fname} {appointment.patient_lname}
                      </CardTitle>
                      <CardDescription className="mt-1">{appointment.patient_email}</CardDescription>
                    </div>
                    {getStatusBadge(appointment)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-foreground">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Dr. {appointment.doctor_fname} {appointment.doctor_lname}
                      </span>
                    </div>
                    <div className="flex items-center text-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.department}</span>
                    </div>
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

                    {!appointment.completed && !appointment.cancelled && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, true, false)}
                          disabled={updatingId === appointment.id}
                          className="flex-1 text-green-600 hover:text-green-600"
                        >
                          {updatingId === appointment.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, false, true)}
                          disabled={updatingId === appointment.id}
                          className="flex-1 text-red-600 hover:text-red-600"
                        >
                          {updatingId === appointment.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
