import { Navbar } from "@/components/navbar"
import { DoctorsList } from "@/components/doctors-list"

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Doctors</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet our team of experienced healthcare professionals dedicated to providing you with the highest quality
              medical care.
            </p>
          </div>
          <DoctorsList />
        </div>
      </main>
    </div>
  )
}
