"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, MapPin, Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Doctor {
  id: number
  fname: string
  lname: string
  department: string
  description: string
  timeranges: string
  yoe: number
}

interface BookingFormProps {
  doctorId: string
}

export function BookingForm({ doctorId }: BookingFormProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchDoctor()
  }, [doctorId])

  const fetchDoctor = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors")
      if (response.ok) {
        const doctors = await response.json()
        const foundDoctor = doctors.find((d: Doctor) => d.id === Number.parseInt(doctorId))
        if (foundDoctor) {
          setDoctor(foundDoctor)
        } else {
          setError("Doctor not found")
        }
      } else {
        setError("Failed to fetch doctor information")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time")
      return
    }

    setBooking(true)
    setError("")

    try {
      const appointmentDateTime = `${selectedDate} ${selectedTime}:00`

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          doctorid: Number.parseInt(doctorId),
          time: appointmentDateTime,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/appointments")
        }, 2000)
      } else {
        setError(data.error || "Failed to book appointment")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setBooking(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends for simplicity
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split("T")[0])
      }
    }

    return dates
  }

  const getAvailableTimes = () => {
    if (!doctor?.timeranges) return []
    return doctor.timeranges.split(",").map((time) => time.trim())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">Please log in to book an appointment</p>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading doctor information...</p>
        </CardContent>
      </Card>
    )
  }

  if (error && !doctor) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-green-800">Appointment Booked Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            Your appointment with Dr. {doctor?.fname} {doctor?.lname} has been confirmed.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to your appointments...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Doctor Information */}
      {doctor && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary" />
                  Dr. {doctor.fname} {doctor.lname}
                </CardTitle>
                <CardDescription className="flex items-center mt-2 text-base">
                  <MapPin className="h-4 w-4 mr-1" />
                  {doctor.department}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center">
                {doctor.yoe} years experience
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{doctor.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Select Date & Time
          </CardTitle>
          <CardDescription>Choose your preferred appointment slot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Date Selection */}
          <div>
            <h4 className="font-medium mb-3">Available Dates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getAvailableDates().map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-left">
                    <div className="font-medium">{formatDate(date)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Available Times
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {getAvailableTimes().map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Doctor:</strong> Dr. {doctor?.fname} {doctor?.lname}
                </div>
                <div>
                  <strong>Department:</strong> {doctor?.department}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </div>
                <div>
                  <strong>Time:</strong> {selectedTime}
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || booking}
            className="w-full"
            size="lg"
          >
            {booking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
