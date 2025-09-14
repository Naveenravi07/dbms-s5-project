import { Navbar } from "@/components/navbar"
import { AppointmentsList } from "@/components/appointments-list"

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">My Appointments</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              View and manage your upcoming and past appointments with our healthcare professionals.
            </p>
          </div>
          <AppointmentsList />
        </div>
      </main>
    </div>
  )
}
