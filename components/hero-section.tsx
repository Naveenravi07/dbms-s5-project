import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Book appointments with our experienced doctors quickly and easily. Quality healthcare is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/doctors">
              <Button size="lg" className="w-full sm:w-auto">
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/departments">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                View Departments
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground text-center">Schedule appointments with just a few clicks</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-secondary/10 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Service</h3>
              <p className="text-muted-foreground text-center">Minimal waiting times with efficient scheduling</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Care</h3>
              <p className="text-muted-foreground text-center">Experienced doctors and quality healthcare</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
