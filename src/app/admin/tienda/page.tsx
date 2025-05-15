"use client"

import { useState, useEffect, ChangeEvent, useRef } from "react"
import { Search, Filter } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "../tatuajes/tatuajes.css"
import "./tienda.css"

interface Producto {
  id: number
  nombre: string
  precio: number
  cat: string
  disponible: boolean
  foto: string | null
}

export default function TiendaAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCat, setFilterCat] = useState("")
  const fileInputRefs = useRef<{[key: number]: HTMLInputElement | null}>({})

  const categorias = ["piercing", "cuidado", "materiales"]

  useEffect(() => {
    const fetchProductos = async () => {
      await refreshCSRF()
      setIsLoading(true)
      const res = await fetch(`${BACKEND}/api/producto/piercings_venta/`, { credentials: 'include' })
      const data: Producto[] = await res.json()
      setProductos(data)
      setIsLoading(false)
    }
    fetchProductos()
  }, [])

  const handleConfirmUpload = async (id: number) => {
    const input = fileInputRefs.current[id]
    if (!input?.files?.[0]) {
      alert("Por favor selecciona un archivo primero")
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('foto', input.files[0])
      
      await refreshCSRF()
      const res = await fetch(`${BACKEND}/api/producto/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `Error HTTP! estado: ${res.status}`)
      }

      const updated: Producto = await res.json()
      setProductos(prev => prev.map(p => 
        p.id === id ? { ...p, foto: updated.foto } : p
      ))
      
      // Resetear input
      input.value = ''
      alert('Foto actualizada correctamente')

    } catch (error) {
      console.error('Error en la subida:', error)
      alert(error instanceof Error ? error.message : 'Error desconocido al subir la foto')
    }
  }

  const filtered = productos.filter(p => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = p.nombre.toLowerCase().includes(term)
    const matchesFilter = filterCat === "" || p.cat === filterCat
    return matchesSearch && matchesFilter
  })

  return (
    <div className="tienda-admin">
      <div className="tienda-header">
        <h1 className="tienda-title">Piercings en Venta</h1>
      </div>

      <div className="tienda-filters">
        {/* ... (filtros sin cambios) */}
      </div>

      {isLoading ? (
        <div className="tienda-loading">
          <div className="loading-spinner"></div>
          <p>Cargando piercings...</p>
        </div>
      ) : (
        <div className="productos-grid">
          {filtered.map(p => (
            <div key={`producto-${p.id}`} className="producto-card">
              <div className="producto-imagen-container">
                <img
                  src={p.foto ? `${p.foto}?${Date.now()}` : "/placeholder.svg"}
                  alt={p.nombre}
                  className="producto-imagen"
                />
                <div className="producto-stock">Stock: {p.disponible ? 'Disponible' : 'Agotado'}</div>
                
                <div className="upload-controls">
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => {
                      if (el) fileInputRefs.current[p.id] = el
                      else delete fileInputRefs.current[p.id]
                    }}
                    id={`file-input-${p.id}`}
                    onChange={() => {}}
                  />
                  <label 
                    htmlFor={`file-input-${p.id}`}
                    className="button button-outline"
                  >
                    Examinar
                  </label>
                  
                  {fileInputRefs.current[p.id]?.files?.[0] && (
                    <div className="upload-actions">
                      <span>{fileInputRefs.current[p.id]?.files?.[0].name}</span>
                      <button
                        className="button button-primary"
                        onClick={() => handleConfirmUpload(p.id)}
                      >
                        Subir
                      </button>
                      <button
                        className="button button-ghost"
                        onClick={() => {
                          if (fileInputRefs.current[p.id]) {
                            fileInputRefs.current[p.id]!.value = ''
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="producto-content">
                <h3 className="producto-nombre">{p.nombre}</h3>
                <p className="producto-categoria">{p.cat}</p>
                <p className="producto-precio">{Number(p.precio).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}