// src/components/admin/admin-sidebar.tsx
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Palette,
  CircleDot,
  Package,
  ShoppingBag,
  BarChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon
} from "lucide-react"
import { UserRole } from "@/src/types/userrole"
import "./admin-sidebar.css"
import { refreshCSRF } from "@/src/hooks/use_auth"
import { BACKEND } from "@/src/types/commons"

interface Props {
  userType: UserRole | null
  onCollapse?(collapsed: boolean): void
}

export default function AdminSidebar({ userType, onCollapse }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [currentRole, setCurrentRole] = useState<UserRole | null>(userType)
  useEffect(() => { setCurrentRole(userType) }, [userType])

  useEffect(() => {
    fetch(`${BACKEND}/api/auth/check/`, {
      method: "GET",
      credentials: "include"
    }).catch(console.error)
  }, [BACKEND])

  const toggleSidebar = () => {
    setIsCollapsed(c => !c)
    onCollapse?.(!isCollapsed)
  }

  const handleLogout = async () => {
    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) router.replace("/login")
    else console.error("Logout fallido", await res.json())
  }

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path)

  return (
    <div className={`admin-sidebar ${isCollapsed ? "admin-sidebar-collapsed" : ""}`}>
      <div className="admin-sidebar-header">
        <Link href="/admin/dashboard" className="admin-sidebar-logo">
          {!isCollapsed && "ViniloStudio"}
        </Link>
        <button onClick={toggleSidebar} className="admin-sidebar-toggle">
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="admin-sidebar-nav">
        <Link
          href="/admin/dashboard"
          className={`admin-sidebar-link ${isActive("/admin/dashboard") ? "active" : ""}`}
        >
          <LayoutDashboard size={20} /> {!isCollapsed && "Dashboard"}
        </Link>
        {currentRole === "tatuador" && (
          <>
            <Link
              href="/admin/tatuajes"
              className={`admin-sidebar-link ${isActive("/admin/tatuajes") ? "active" : ""}`}
            >
              <Palette size={20} /> {!isCollapsed && "Tatuajes"}
            </Link>
            <Link
              href="/admin/materiales"
              className={`admin-sidebar-link ${isActive("/admin/materiales") ? "active" : ""}`}
            >
              <Package size={20} /> {!isCollapsed && "Uso de Materiales"}
            </Link>
          </>
        )}
        {currentRole === "perforador" && (
          <>
            <Link
              href="/admin/piercings"
              className={`admin-sidebar-link ${isActive("/admin/piercings") ? "active" : ""}`}
            >
              <CircleDot size={20} /> {!isCollapsed && "Piercings"}
            </Link>
            <Link
              href="/admin/materiales"
              className={`admin-sidebar-link ${isActive("/admin/materiales") ? "active" : ""}`}
            >
              <Package size={20} /> {!isCollapsed && "Uso de Materiales"}
            </Link>
            <Link
              href="/admin/tienda"
              className={`admin-sidebar-link ${isActive("/admin/tienda") ? "active" : ""}`}
            >
              <ShoppingBag size={20} /> {!isCollapsed && "Tienda"}
            </Link>
            <Link
              href="/admin/ventas"
              className={`admin-sidebar-link ${isActive("/admin/ventas") ? "active" : ""}`}
            >
              <BarChart size={20} /> {!isCollapsed && "Ventas"}
            </Link>
          </>
        )}
        {currentRole === "administrador" && (
          <>
            <Link
              href="/admin/finanzas"
              className={`admin-sidebar-link ${isActive("/admin/finanzas") ? "active" : ""}`}
            >
              <BarChart size={20} /> {!isCollapsed && "Finanzas"}
            </Link>
            <Link
              href="/admin/inventario"
              className={`admin-sidebar-link ${isActive("/admin/inventario") ? "active" : ""}`}
            >
              <Package size={20} /> {!isCollapsed && "Inventario"}
            </Link>
            <Link
              href="/admin/abastecimiento"
              className={`admin-sidebar-link ${isActive("/admin/abastecimiento") ? "active" : ""}`}
            >
              <ShoppingBag size={20} /> {!isCollapsed && "Abastecimiento"}
            </Link>
          </>
        )}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="admin-sidebar-link"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />} {!isCollapsed && "Tema"}
        </button>
        <button onClick={handleLogout} className="admin-sidebar-link logout-button">
          <LogOut size={20} /> {!isCollapsed && "Cerrar sesión"}
        </button>
      </nav>
    </div>
)
}
