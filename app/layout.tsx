import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "UCLA Recruitment Platform",
  description: "Connect UCLA students with top recruiters",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
