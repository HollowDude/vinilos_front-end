// app/admin/layout.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ThemeProvider } from "@/src/components/theme-provider"
import AdminSidebar from "@/src/components/admin/admin-sidebar"
import { UserRole, AuthCheck } from "@/src/types/userrole"
import { BACKEND } from "@/src/types/commons"
import "./admin.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router    = useRouter()
  const pathname  = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/auth/check/`, {
          method: 'GET',
          credentials: 'include'
        })
        const data: AuthCheck = await res.json()

        if (!data.authenticated || !data.tipo_user) {
          // no autorizado → login
          router.replace("/login")
          return
        }

        // guardamos rol y seguimos
        setUserType(data.tipo_user)
      } catch {
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }
    // Sólo comprobamos en rutas que empiecen por /admin
    if (pathname.startsWith("/admin")) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="admin-layout">
        <AdminSidebar userType={userType} onCollapse={() => {}} />
        <main className={`admin-main`}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}