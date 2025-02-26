import type React from "react"
import { Inria_Serif } from "next/font/google"
import "./globals.css"

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inria-serif",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inriaSerif.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

