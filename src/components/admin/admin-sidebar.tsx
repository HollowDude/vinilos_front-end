"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Palette,
  CircleDot,
  ShoppingBag,
  BarChart,
  Package,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import "./admin-sidebar.css"

interface AdminSidebarProps {
  userType: string | null
  onCollapse?: (collapsed: boolean) => void
}

export default function AdminSidebar({ userType, onCollapse }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Estado local para el rol
  const [currentRole, setCurrentRole] = useState<string | null>(userType)

  // Actualizar el rol local cuando cambie el prop
  useEffect(() => {
    if (userType) {
      setCurrentRole(userType)
    }
  }, [userType])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onCollapse) {
      onCollapse(newCollapsedState)
    }
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleLogout = async () => {
    try {
      // Comentamos la API real
      /*
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      */

      // Simulamos el logout
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Limpiar el rol almacenado
      localStorage.removeItem("userRole")

      router.push("/login")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Función para cambiar de rol (para pruebas)
  const changeRole = (role: string) => {
    localStorage.setItem("userRole", role)
    setCurrentRole(role)
    router.push(`/admin/dashboard`)
  }

  return (
    <>
      <div
        className={`admin-sidebar ${isCollapsed ? "admin-sidebar-collapsed" : ""} ${isMobileOpen ? "admin-sidebar-mobile-open" : ""}`}
      >
        <div className="admin-sidebar-header">
          <Link href="/admin/dashboard" className="admin-sidebar-logo">
            {!isCollapsed && "ViniloStudio"}
          </Link>
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <Link
            href="/admin/dashboard"
            className={`admin-sidebar-link ${isActive("/admin/dashboard") ? "active" : ""}`}
          >
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          {/* Enlaces para Tatuador */}
          {currentRole === "tatuador" && (
            <>
              <Link
                href="/admin/tatuajes"
                className={`admin-sidebar-link ${isActive("/admin/tatuajes") ? "active" : ""}`}
              >
                <Palette size={20} />
                {!isCollapsed && <span>Tatuajes</span>}
              </Link>
              <Link
                href="/admin/materiales"
                className={`admin-sidebar-link ${isActive("/admin/materiales") ? "active" : ""}`}
              >
                <Package size={20} />
                {!isCollapsed && <span>Uso de Materiales</span>}
              </Link>
            </>
          )}

          {/* Enlaces para Perforador */}
          {currentRole === "perforador" && (
            <>
              <Link
                href="/admin/piercings"
                className={`admin-sidebar-link ${isActive("/admin/piercings") ? "active" : ""}`}
              >
                <CircleDot size={20} />
                {!isCollapsed && <span>Piercings</span>}
              </Link>
              <Link
                href="/admin/materiales"
                className={`admin-sidebar-link ${isActive("/admin/materiales") ? "active" : ""}`}
              >
                <Package size={20} />
                {!isCollapsed && <span>Uso de Materiales</span>}
              </Link>
              <Link href="/admin/tienda" className={`admin-sidebar-link ${isActive("/admin/tienda") ? "active" : ""}`}>
                <ShoppingBag size={20} />
                {!isCollapsed && <span>Tienda</span>}
              </Link>
              <Link href="/admin/ventas" className={`admin-sidebar-link ${isActive("/admin/ventas") ? "active" : ""}`}>
                <BarChart size={20} />
                {!isCollapsed && <span>Ventas</span>}
              </Link>
            </>
          )}

          {/* Enlaces para Administrador */}
          {currentRole === "administrador" && (
            <>
              <Link
                href="/admin/finanzas"
                className={`admin-sidebar-link ${isActive("/admin/finanzas") ? "active" : ""}`}
              >
                <BarChart size={20} />
                {!isCollapsed && <span>Finanzas</span>}
              </Link>
              <Link
                href="/admin/inventario"
                className={`admin-sidebar-link ${isActive("/admin/inventario") ? "active" : ""}`}
              >
                <Package size={20} />
                {!isCollapsed && <span>Inventario</span>}
              </Link>
              <Link
                href="/admin/abastecimiento"
                className={`admin-sidebar-link ${isActive("/admin/abastecimiento") ? "active" : ""}`}
              >
                <ShoppingBag size={20} />
                {!isCollapsed && <span>Abastecimiento</span>}
              </Link>
            </>
          )}

          {/* Selector de rol (solo para pruebas) */}
          {!isCollapsed && (
            <div className="role-selector">
              <button
                className={`role-button ${currentRole === "tatuador" ? "active" : ""}`}
                onClick={() => changeRole("tatuador")}
              >
                Tatuador
              </button>
              <button
                className={`role-button ${currentRole === "perforador" ? "active" : ""}`}
                onClick={() => changeRole("perforador")}
              >
                Perforador
              </button>
              <button
                className={`role-button ${currentRole === "administrador" ? "active" : ""}`}
                onClick={() => changeRole("administrador")}
              >
                Admin
              </button>
            </div>
          )}

          <button className="admin-sidebar-link theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && <span>Cambiar tema</span>}
          </button>

          <button className="admin-sidebar-link logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </nav>
      </div>

      {/* Botón móvil para abrir el sidebar */}
      {isMobileOpen ? null : (
        <button className="admin-sidebar-mobile-toggle" onClick={toggleMobileSidebar}>
          <ChevronRight size={24} />
        </button>
      )}

      {/* Overlay para cerrar el sidebar en móvil */}
      {isMobileOpen && <div className="admin-sidebar-overlay" onClick={toggleMobileSidebar}></div>}
    </>
  )
}

