"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Award, Search, Filter, Server } from "lucide-react"
import Link from "next/link"
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

export function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const { backendConnected } = useAuth()

  useEffect(() => {
    if (backendConnected) {
      fetchDoctors()
    } else {
      setLoading(false)
      setError("Backend server not connected")
    }
  }, [backendConnected])

  useEffect(() => {
    filterDoctors()
  }, [doctors, searchTerm, selectedDepartment])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors")
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
        setError("")
      } else {
        setError("Failed to fetch doctors")
      }
    } catch (error) {
      setError("Unable to connect to backend server")
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    let filtered = doctors

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((doctor) => doctor.department === selectedDepartment)
    }

    setFilteredDoctors(filtered)
  }

  const getDepartments = () => {
    const departments = [...new Set(doctors.map((doctor) => doctor.department))]
    return departments.sort()
  }

  if (!backendConnected) {
    return (
      <Alert>
        <Server className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend Server Required</strong>
          <br />
          To view doctors and book appointments, please start the Flask backend server at localhost:5000.
          <br />
          <br />
          <strong>Quick Start:</strong>
          <br />
          1. Navigate to the backend directory
          <br />
          2. Install dependencies: <code className="bg-muted px-1 rounded">pip install -r requirements.txt</code>
          <br />
          3. Start server: <code className="bg-muted px-1 rounded">python app.py</code>
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-full sm:w-48">
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Loading skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
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

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {getDepartments().map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredDoctors.length} of {doctors.length} doctors
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters to find more doctors.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Dr. {doctor.fname} {doctor.lname}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {doctor.department}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    {doctor.yoe} years
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{doctor.description}</p>

                {doctor.timeranges && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Available Times:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.timeranges
                        .split(",")
                        .slice(0, 3)
                        .map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time.trim()}
                          </Badge>
                        ))}
                      {doctor.timeranges.split(",").length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doctor.timeranges.split(",").length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Link href={`/book/${doctor.id}`}>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
