import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/src/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ViniloStudio - Tatuajes y Piercings",
  description: "Estudio de tatuajes y piercings con venta de artículos",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
