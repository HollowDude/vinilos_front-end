"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ThemeProvider } from "@/src/components/theme-provider"
import AdminSidebar from "@/src/components/admin/admin-sidebar"
import "./admin.css"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userType, setUserType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar la autenticación al cargar
    const checkAuth = async () => {
      try {
        // Comentamos la API real
        /*
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('No autenticado')
        }
        
        const data = await response.json()
        setUserType(data.tipo_user)
        */

        // Simulamos la verificación de autenticación
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Obtenemos el tipo de usuario de la URL específica de rol
        if (pathname.includes("/admin/tatuador")) {
          setUserType("tatuador")
        } else if (pathname.includes("/admin/perforador")) {
          setUserType("perforador")
        } else if (pathname.includes("/admin/administrador")) {
          setUserType("administrador")
        } else {
          // Si no estamos en una ruta específica de rol, mantenemos el rol actual
          // o usamos el rol almacenado en localStorage
          const storedRole = localStorage.getItem("userRole")
          if (storedRole && !userType) {
            setUserType(storedRole)
          } else if (!userType) {
            // Por defecto, si no hay rol almacenado, asumimos administrador
            setUserType("administrador")
          }
        }
      } catch (err) {
        console.error("Error de autenticación:", err)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router, userType])

  // Guardar el rol en localStorage cuando cambie
  useEffect(() => {
    if (userType) {
      localStorage.setItem("userRole", userType)
    }
  }, [userType])

  // Manejar el estado de colapso de la barra lateral
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

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
        <AdminSidebar userType={userType} onCollapse={handleSidebarCollapse} />
        <div className={`admin-main ${isSidebarCollapsed ? "admin-main-collapsed" : ""}`}>
          <div className="admin-content">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  )
}

