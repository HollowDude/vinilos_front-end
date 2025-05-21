"use client"

import { useState, useEffect, useRef } from "react"
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
    const input = fileInputRefs.current[id]
    const file = input?.files?.[0]
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

      if (input) {
        input.value = ""
      }
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
            const inputRef = fileInputRefs.current[p.id]
            const selectedFile = inputRef?.files?.[0]

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
                    />
                    <label
                      htmlFor={`file-input-${p.id}`}
                      className="button button-outline"
                    >
                      Examinar
                    </label>
                    <div className="upload-actions">
                      {selectedFile && <span>{selectedFile.name}</span>}
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
