"use client"

import { useState, useEffect } from "react"
import { Activity, Package, Palette, Scissors, ShoppingBag } from "lucide-react"
import "./dashboard.css"

// Definir interfaces para los tipos de datos
interface DashboardStats {
  piercingsInventario: number
  tatuajesRealizados: number
  piercingsVendidos: number
  productosInventario: number
}

interface ActividadReciente {
  id: number
  tipo: "venta" | "abastecimiento" | "tatuaje" | "piercing"
  descripcion: string
  fecha: string
  usuario: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    piercingsInventario: 0,
    tatuajesRealizados: 0,
    piercingsVendidos: 0,
    productosInventario: 0,
  })
  const [actividades, setActividades] = useState<ActividadReciente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En un caso real, esto sería una llamada a la API
        // const response = await fetch('/api/dashboard/stats')
        // const data = await response.json()
        // setStats(data.stats)
        // setActividades(data.actividades)

        // Simulamos datos para el ejemplo
        setTimeout(() => {
          setStats({
            piercingsInventario: 45,
            tatuajesRealizados: 128,
            piercingsVendidos: 87,
            productosInventario: 64,
          })

          setActividades([
            {
              id: 1,
              tipo: "venta",
              descripcion: "Venta de Piercing de Titanio",
              fecha: "2023-05-20T16:45:22",
              usuario: "Vendedor",
            },
            {
              id: 2,
              tipo: "abastecimiento",
              descripcion: "Abastecimiento de Crema para Cuidado",
              fecha: "2023-05-18T09:15:30",
              usuario: "Admin",
            },
            {
              id: 3,
              tipo: "tatuaje",
              descripcion: "Tatuaje realizado: Dragón Japonés",
              fecha: "2023-05-17T14:30:00",
              usuario: "Carlos Mendez",
            },
            {
              id: 4,
              tipo: "piercing",
              descripcion: "Piercing colocado: Septum",
              fecha: "2023-05-16T11:20:15",
              usuario: "Ana Martínez",
            },
            {
              id: 5,
              tipo: "venta",
              descripcion: "Venta de Expansor de Madera",
              fecha: "2023-05-15T10:05:45",
              usuario: "Vendedor",
            },
          ])

          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Función para formatear fechas
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffDays > 0) {
      return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`
    } else if (diffHours > 0) {
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
    } else {
      return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`
    }
  }

  // Función para obtener el icono según el tipo de actividad
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case "venta":
        return <ShoppingBag size={16} />
      case "abastecimiento":
        return <Package size={16} />
      case "tatuaje":
        return <Palette size={16} />
      case "piercing":
        return <Scissors size={16} />
      default:
        return <Activity size={16} />
    }
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      {isLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Scissors size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">Piercings en Inventario</h3>
                <p className="stat-value">{stats.piercingsInventario}</p>
                <p className="stat-description">Unidades disponibles</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Palette size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">Tatuajes Realizados</h3>
                <p className="stat-value">{stats.tatuajesRealizados}</p>
                <p className="stat-description">Total histórico</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">Piercings Vendidos</h3>
                <p className="stat-value">{stats.piercingsVendidos}</p>
                <p className="stat-description">Total histórico</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">Productos en Inventario</h3>
                <p className="stat-value">{stats.productosInventario}</p>
                <p className="stat-description">Unidades totales</p>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <div className="chart-card">
              <h3 className="chart-title">Actividad Reciente</h3>
              <div className="activity-list">
                {actividades.map((actividad) => (
                  <div key={actividad.id} className={`activity-item tipo-${actividad.tipo}`}>
                    <div className="activity-icon">{getActivityIcon(actividad.tipo)}</div>
                    <div className="activity-content">
                      <p className="activity-text">{actividad.descripcion}</p>
                      <div className="activity-details">
                        <span className="activity-user">{actividad.usuario}</span>
                        <span className="activity-time">{formatDate(actividad.fecha)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

