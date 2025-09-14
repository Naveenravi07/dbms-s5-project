export function StatsSection() {
  const stats = [
    { number: "50+", label: "Expert Doctors" },
    { number: "10,000+", label: "Happy Patients" },
    { number: "15+", label: "Departments" },
    { number: "24/7", label: "Emergency Care" },
  ]

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Our commitment to excellence has made us a leading healthcare provider in the region.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{stat.number}</div>
              <div className="text-primary-foreground/80 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
