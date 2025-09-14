"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, User, MapPin, Award } from "lucide-react"

interface Doctor {
  id: number
  fname: string
  lname: string
  department: string
  description: string
  timeranges: string
  yoe: number
}

export function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    department: "",
    description: "",
    timeranges: "",
    yoe: 0,
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
      } else {
        setError("Failed to fetch doctors")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingDoctor
        ? `http://localhost:5000/api/doctors/${editingDoctor.id}`
        : "http://localhost:5000/api/doctors"
      const method = editingDoctor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(editingDoctor ? "Doctor updated successfully" : "Doctor added successfully")
        setIsDialogOpen(false)
        resetForm()
        fetchDoctors()
      } else {
        setError(data.error || "Operation failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleDelete = async (doctorId: number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Doctor deleted successfully")
        fetchDoctors()
      } else {
        setError(data.error || "Failed to delete doctor")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      fname: doctor.fname,
      lname: doctor.lname,
      department: doctor.department,
      description: doctor.description,
      timeranges: doctor.timeranges,
      yoe: doctor.yoe,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingDoctor(null)
    setFormData({
      fname: "",
      lname: "",
      department: "",
      description: "",
      timeranges: "",
      yoe: 0,
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
    setError("")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Doctors Management</h1>
            <p className="text-muted-foreground">Manage healthcare professionals</p>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

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
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-16" />
                  <div className="h-8 bg-muted rounded w-16" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Doctors Management</h1>
          <p className="text-muted-foreground">Manage healthcare professionals</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
              <DialogDescription>
                {editingDoctor ? "Update doctor information" : "Add a new healthcare professional to the system"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input
                    id="fname"
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input
                    id="lname"
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yoe">Years of Experience</Label>
                  <Input
                    id="yoe"
                    type="number"
                    min="0"
                    value={formData.yoe}
                    onChange={(e) => setFormData({ ...formData, yoe: Number.parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeranges">Available Time Slots</Label>
                <Input
                  id="timeranges"
                  value={formData.timeranges}
                  onChange={(e) => setFormData({ ...formData, timeranges: e.target.value })}
                  placeholder="e.g., 09:00,10:00,11:00,14:00,15:00"
                />
                <p className="text-xs text-muted-foreground">Comma-separated time slots (24-hour format)</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingDoctor ? "Update Doctor" : "Add Doctor"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(error || success) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertDescription>{error || success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
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

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(doctor)} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(doctor.id)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first healthcare professional.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Doctor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
