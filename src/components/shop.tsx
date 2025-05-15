// src/components/shop.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import "./shop.css"
import { BACKEND } from "../types/commons"

interface PiercingProduct {
  id: number
  nombre: string
  precio: number
  foto: string | null
}

export default function Shop() {
  const [products, setProducts] = useState<PiercingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BACKEND}/api/producto/piercings_venta/`)
      .then(async res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json() as Promise<{ id: number; nombre: string; precio: string; foto: string | null }[]>
      })
      .then(data => {
        const items: PiercingProduct[] = data.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: parseFloat(item.precio),
          foto: item.foto
        }))
        setProducts(items)
      })
      .catch(err => {
        console.error("Error cargando piercings:", err)
        setError("No se pudieron cargar los piercings.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando productos…</p>
  if (error) return <p className="error">{error}</p>

  const scheduleAppointmentLink =
    "https://wa.me/+5358622909?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20un%20piercing."

  return (
    <section className="shop-section">
      <div className="section-container">
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card card card-hover">
              <div className="product-image-container">
                <Image
                  src={product.foto ?? "/placeholder.svg"}
                  alt={product.nombre}
                  fill
                  className="product-image"
                />
              </div>
              <div className="product-content">
                <h3 className="product-name">{product.nombre}</h3>
                <p className="product-price">{product.precio.toFixed(2)} CUP</p>
              </div>
              <div className="product-footer">
                <a
                  className="button button-outline product-button"
                  href={scheduleAppointmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar para Comprar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
