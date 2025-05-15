"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "./materiales.css"

interface ReporteMaterial {
  id: number
  fecha: string
  materiales: number[]
  cantidad: number
}

interface Producto {
  id: number
  nombre: string
}

export default function MaterialesAdmin() {
  const [reportes, setReportes] = useState<ReporteMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFecha, setFilterFecha] = useState("")

  const [newCantidad, setNewCantidad] = useState(1)
  const [newMaterialNombre, setNewMaterialNombre] = useState<string>("")
  const [productos, setProductos] = useState<Producto[]>([])

  // Obtener nombres únicos de materiales
  const uniqueMateriales = [...new Set(productos.map(p => p.nombre))]

  // Mapa rápido de nombres a primer ID (para visualización)
  const nombreToPrimerId = new Map(
    productos.map(p => [p.nombre, p.id])
  )

  // Mapa de IDs a nombres
  const idToNombre = new Map(
    productos.map(p => [p.id, p.nombre])
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshCSRF()
        setIsLoading(true)
        
        const [repRes, matRes] = await Promise.all([
          fetch(`${BACKEND}/api/reporte_uso_material/`, { credentials: 'include' }),
          fetch(`${BACKEND}/api/producto/?cat=materiales&disponible=true`, { credentials: 'include' })
        ])

        if (!repRes.ok || !matRes.ok) throw new Error('Error cargando datos')

        const [repData, prodData] = await Promise.all([
          repRes.json() as Promise<ReporteMaterial[]>,
          matRes.json() as Promise<Producto[]>
        ])

        setReportes(repData)
        setProductos(prodData)

      } catch (error) {
        console.error('Error:', error)
        alert(error instanceof Error ? error.message : 'Error de conexión')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = reportes.filter(r => {
    const term = searchTerm.toLowerCase()
    const matchSearch = String(r.cantidad).includes(term)
    const matchFilter = !filterFecha || r.fecha.startsWith(filterFecha)
    return matchSearch && matchFilter
  })

  const handleSaveNew = async () => {
    try {
      if (!newMaterialNombre || newCantidad <= 0) {
        alert("Seleccione material y cantidad válida")
        return
      }

      await refreshCSRF()
      const res = await fetch(`${BACKEND}/api/reporte_uso_material/`, {
        method: 'POST', 
        credentials: 'include', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          material_nombre: newMaterialNombre,
          cantidad: newCantidad
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error creando reporte')
      }

      const created: ReporteMaterial = await res.json()
      setReportes([created, ...reportes])
      setNewMaterialNombre("")
      setNewCantidad(1)

    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  return (
    <div className="materiales-admin">
      <div className="materiales-header">
        <h1 className="materiales-title">Uso de Materiales</h1>
        <button 
          className="button button-primary" 
          onClick={() => setNewMaterialNombre(productos[0]?.nombre || "")}
        >
          <Plus size={16}/> <span>Registrar Uso</span>
        </button>
      </div>

      <div className="materiales-filters">
        <div className="search-container">
          <Search size={18} className="search-icon"/>
          <input
            type="text"
            placeholder="Buscar cantidad..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <Filter size={18} className="filter-icon"/>
          <input
            type="date"
            className="filter-select"
            value={filterFecha}
            onChange={e => setFilterFecha(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="materiales-loading">
          <div className="loading-spinner"></div>
          <p>Cargando registros...</p>
        </div>
      ) : (
        <div className="materiales-table-container">
          <table className="materiales-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Material</th>
                <th>Cantidad</th>
              </tr>
            </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                    <td>{idToNombre.get(r.materiales[0]) || 'Material no registrado'}</td>
                    <td>{r.cantidad}</td>
                  </tr>
                ))}

                {newMaterialNombre && (
                  <tr>
                    <td>{new Date().toLocaleDateString('es-ES')}</td>
                    <td>
                      <select
                        className="admin-form-select"
                        value={newMaterialNombre}
                        onChange={e => setNewMaterialNombre(e.target.value)}
                      >
                        <option value="">Seleccione material...</option>
                        {uniqueMateriales.map(nombre => (
                          <option key={nombre} value={nombre}>
                            {nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      className="admin-form-input"
                      value={newCantidad}
                      onChange={e => setNewCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </td>
                  <td className="material-acciones">
                    <button className="button button-primary" onClick={handleSaveNew}>
                      Aceptar
                    </button>
                    <button 
                      className="button button-ghost button-danger" 
                      onClick={() => setNewMaterialNombre("")}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}