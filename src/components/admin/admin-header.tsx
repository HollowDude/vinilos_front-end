"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, User, LogOut, Settings } from "lucide-react"
import "./admin-header.css"

interface AdminHeaderProps {
  userType: string | null
}

export default function AdminHeader({ userType }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

      router.push("/login")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    }
  }

  const getUserTypeLabel = () => {
    switch (userType) {
      case "tatuador":
        return "Tatuador"
      case "perforador":
        return "Perforador"
      case "administrador":
        return "Administrador"
      default:
        return "Usuario"
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <h1>Panel de Administración</h1>
        <span className="admin-user-type">{getUserTypeLabel()}</span>
      </div>

      <div className="admin-header-actions">
        <button className="admin-header-button">
          <Bell size={20} />
          <span className="admin-notification-badge">3</span>
        </button>

        <div className="admin-user-dropdown" ref={dropdownRef}>
          <button className="admin-user-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="admin-user-avatar">
              <User size={20} />
            </div>
            <span className="admin-user-name">Usuario</span>
          </button>

          {isDropdownOpen && (
            <div className="admin-dropdown-menu">
              <button className="admin-dropdown-item">
                <User size={16} />
                <span>Mi Perfil</span>
              </button>
              <button className="admin-dropdown-item">
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <button className="admin-dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

