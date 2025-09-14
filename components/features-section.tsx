import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Calendar, Shield, Clock, Heart } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Expert Medical Team",
      description: "Our experienced doctors and specialists provide comprehensive healthcare services.",
    },
    {
      icon: Stethoscope,
      title: "Advanced Equipment",
      description: "State-of-the-art medical equipment for accurate diagnosis and treatment.",
    },
    {
      icon: Calendar,
      title: "Online Booking",
      description: "Easy online appointment scheduling system available 24/7.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your medical information is protected with the highest security standards.",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Extended hours and emergency services to meet your healthcare needs.",
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Patient-centered approach with personalized treatment plans.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose MediCare Hospital?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive healthcare services with a focus on quality, convenience, and patient satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
