"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ThemeProvider } from "@/src/components/theme-provider"
import AdminSidebar from "@/src/components/admin/admin-sidebar"
import { UserRole, AuthCheck } from "@/src/types/userrole"
import { BACKEND } from "@/src/types/commons"
import "./admin.css"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [userType, setUserType] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/auth/check/`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = (await res.json()) as AuthCheck

        if (!data.authenticated || !data.tipo_user) {
          router.replace("/login")
          return
        }

        setUserType(data.tipo_user)
      } catch (err: unknown) {
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }

    if (pathname.startsWith("/admin")) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [router, pathname, BACKEND])

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
        <main className="admin-main">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}