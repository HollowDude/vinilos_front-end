"use client"

import { useState, useEffect } from "react"
import { Activity, Package, Palette, Scissors, ShoppingBag } from "lucide-react"
import "./dashboard.css"
import { BACKEND } from "@/src/types/commons"

// Ajustamos la interfaz para que encaje con lo que devuelve tu API
interface DashboardStats {
  piercings_inventario: number
  tatuajes_realizados: number
  piercings_vendidos: number
  productos_inventario: number
}

interface ActividadReciente {
  texto: string
  dias_hace: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    piercings_inventario:   0,
    tatuajes_realizados:    0,
    piercings_vendidos:     0,
    productos_inventario:   0,
  })
  const [actividades, setActividades] = useState<ActividadReciente[]>([])
  const [isLoading, setIsLoading]      = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/dashboard/`, {
          credentials: "include"
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        // Mapeamos directamente las keys que devuelve tu endpoint
        setStats({
          piercings_inventario:   data.piercings_inventario,
          tatuajes_realizados:    data.tatuajes_realizados,
          piercings_vendidos:     data.piercings_vendidos,
          productos_inventario:   data.productos_inventario,
        })
        setActividades(data.actividad_reciente)
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Función para formatear "Hace X días"
  const formatDays = (dias: number): string => {
    if (dias === 0) return "Hoy"
    if (dias === 1) return "Hace 1 día"
    return `Hace ${dias} días`
  }

  // Iconos según el primer término del texto
  const getActivityIcon = (texto: string) => {
    const tipo = texto.split(" ")[0].toLowerCase()
    switch (tipo) {
      case "venta":          return <ShoppingBag size={16} />
      case "abastecimiento": return <Package size={16} />
      case "tatuaje":        return <Palette size={16} />
      case "piercing":       return <Scissors size={16} />
      default:               return <Activity size={16} />
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
              <div className="stat-icon"><Scissors size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-title">Piercings en Inventario</h3>
                <p className="stat-value">{stats.piercings_inventario}</p>
                <p className="stat-description">Unidades disponibles</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><Palette size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-title">Tatuajes Realizados</h3>
                <p className="stat-value">{stats.tatuajes_realizados}</p>
                <p className="stat-description">Total histórico</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><ShoppingBag size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-title">Piercings Vendidos</h3>
                <p className="stat-value">{stats.piercings_vendidos}</p>
                <p className="stat-description">Total histórico</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><Package size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-title">Productos en Inventario</h3>
                <p className="stat-value">{stats.productos_inventario}</p>
                <p className="stat-description">Unidades totales</p>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <div className="chart-card">
              <h3 className="chart-title">Actividad Reciente</h3>
              <div className="activity-list">
                {actividades.map((act, idx) => (
                  <div key={idx} className={`activity-item tipo-${act.texto.split(" ")[0].toLowerCase()}`}>
                    <div className="activity-icon">{getActivityIcon(act.texto)}</div>
                    <div className="activity-content">
                      <p className="activity-text">{act.texto}</p>
                      <div className="activity-details">
                        <span className="activity-time">{formatDays(act.dias_hace)}</span>
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