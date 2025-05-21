"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import Image from "next/image"
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
  // Estado para los ficheros seleccionados
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File | null>>({})
  // Refs para poder limpiar los inputs
  const fileInputRefs = useRef<Record<number, HTMLInputElement>>({})

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
    const file = selectedFiles[id]
    if (!file) {
      alert("Por favor selecciona un archivo primero")
      return
    }

    try {
      const formData = new FormData()
      formData.append('foto', file)

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
      setProductos(prev =>
        prev.map(p => p.id === id ? { ...p, foto: updated.foto } : p)
      )

      // Limpiar input y estado
      const input = fileInputRefs.current[id]
      if (input) {
        input.value = ""
      }
      setSelectedFiles(prev => ({ ...prev, [id]: null }))
      alert("Foto actualizada correctamente")
    } catch (err) {
      console.error("Error en la subida:", err)
      alert(err instanceof Error ? err.message : "Error desconocido al subir la foto")
    }
  }

  const handleCancel = (id: number) => {
    const input = fileInputRefs.current[id]
    if (input) {
      input.value = ""
    }
    setSelectedFiles(prev => ({ ...prev, [id]: null }))
  }

  return (
    <div className="tienda-admin">
      <div className="tienda-header">
        <h1 className="tienda-title">Piercings en Venta</h1>
      </div>

      {isLoading ? (
        <div className="tienda-loading">
          <div className="loading-spinner"></div>
          <p>Cargando piercings...</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productos.map(p => {
            const selectedFile = selectedFiles[p.id] ?? null

            return (
              <div key={p.id} className="producto-card">
                <div className="producto-imagen-container">
                  <Image
                    src={p.foto ? `${p.foto}?${Date.now()}` : "/placeholder.svg"}
                    alt={p.nombre}
                    width={200}
                    height={200}
                    className="producto-imagen"
                  />
                  <div className="producto-stock">
                    Stock: {p.disponible ? "Disponible" : "Agotado"}
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      ref={el => {
                        if (el) fileInputRefs.current[p.id] = el
                        else delete fileInputRefs.current[p.id]
                      }}
                      id={`file-input-${p.id}`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null
                        setSelectedFiles(prev => ({ ...prev, [p.id]: file }))
                      }}
                    />
                    <label
                      htmlFor={`file-input-${p.id}`}
                      className="button button-outline"
                    >
                      Examinar
                    </label>

                    {/* Siempre visibles */}
                    <div className="upload-actions">
                      {selectedFile && <span className="file-name">{selectedFile.name}</span>}
                      <button
                        className="button button-primary"
                        onClick={() => handleConfirmUpload(p.id)}
                      >
                        Subir
                      </button>
                      <button
                        className="button button-ghost"
                        onClick={() => handleCancel(p.id)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="producto-content">
                  <h3 className="producto-nombre">{p.nombre}</h3>
                  <p className="producto-categoria">{p.cat}</p>
                  <p className="producto-precio">{Number(p.precio).toFixed(2)} CUP</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
