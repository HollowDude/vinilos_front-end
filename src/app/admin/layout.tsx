"use client"

import { useState, useEffect, ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "./admin-layout.css"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [ready, setReady] = useState(false)
  const pathname = usePathname()

  // Chequeo de sesión al montar
  useEffect(() => {
    const checkSession = async () => {
      await refreshCSRF()
      try {
        await fetch(`${BACKEND}/api/auth/check/`, {
          method: "GET",
          credentials: "include",
        })
      } catch {
        // Si falla, redirigimos al login
        window.location.href = "/login"
      } finally {
        setReady(true)
      }
    }
    checkSession()
  }, []) // BACKEND es constante de módulo, no va en deps

  if (!ready) {
    return <div className="admin-loading">Cargando administración...</div>
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <nav>
          <Link href="/admin/dashboard" className={pathname.startsWith("/admin/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
          <Link href="/admin/finanzas" className={pathname.startsWith("/admin/finanzas") ? "active" : ""}>
            Finanzas
          </Link>
          {/* ... demás enlaces */}
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
