import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"


export const metadata: Metadata = {
  title: "MediCare Hospital - Book Your Appointment",
  description: "Professional healthcare services with easy online appointment booking",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
