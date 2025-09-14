import { Navbar } from "@/components/navbar"
import { BackendStatus } from "@/components/backend-status"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackendStatus />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
      </main>
    </div>
  )
}
