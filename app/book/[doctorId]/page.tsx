import { Navbar } from "@/components/navbar"
import { BookingForm } from "@/components/booking/booking-form"

interface BookingPageProps {
  params: {
    doctorId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Book Appointment</h1>
            <p className="text-lg text-muted-foreground">Select your preferred date and time for your consultation</p>
          </div>
          <BookingForm doctorId={params.doctorId} />
        </div>
      </main>
    </div>
  )
}
