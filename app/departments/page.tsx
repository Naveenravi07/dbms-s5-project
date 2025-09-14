import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Baby, Bone, Eye, Ear } from "lucide-react"

export default function DepartmentsPage() {
  const departments = [
    {
      icon: Heart,
      name: "Cardiology",
      description: "Comprehensive heart and cardiovascular care with advanced diagnostic and treatment options.",
      services: ["ECG", "Echocardiography", "Cardiac Catheterization", "Heart Surgery"],
    },
    {
      icon: Brain,
      name: "Neurology",
      description: "Expert care for brain, spine, and nervous system disorders.",
      services: ["MRI Scans", "EEG", "Stroke Treatment", "Epilepsy Care"],
    },
    {
      icon: Baby,
      name: "Pediatrics",
      description: "Specialized healthcare for infants, children, and adolescents.",
      services: ["Vaccinations", "Growth Monitoring", "Pediatric Surgery", "Child Psychology"],
    },
    {
      icon: Bone,
      name: "Orthopedics",
      description: "Treatment of bone, joint, and muscle conditions and injuries.",
      services: ["Joint Replacement", "Sports Medicine", "Fracture Care", "Physical Therapy"],
    },
    {
      icon: Eye,
      name: "Ophthalmology",
      description: "Complete eye care services from routine exams to complex surgeries.",
      services: ["Eye Exams", "Cataract Surgery", "Glaucoma Treatment", "Retinal Care"],
    },
    {
      icon: Ear,
      name: "ENT",
      description: "Ear, nose, and throat care for all ages.",
      services: ["Hearing Tests", "Sinus Treatment", "Throat Surgery", "Allergy Care"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Departments</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer comprehensive healthcare services across multiple specialties, ensuring you receive the best
              possible care for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((department, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-lg w-fit mb-4">
                    <department.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{department.name}</CardTitle>
                  <CardDescription className="text-base">{department.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3 text-foreground">Services:</h4>
                  <ul className="space-y-2">
                    {department.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
