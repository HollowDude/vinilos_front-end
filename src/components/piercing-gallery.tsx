'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import "./piercing-gallery.css"
import { BACKEND } from "../types/commons"

type Piercing = {
  id: number
  nombre: string
  ubi: string
  foto: string
  precio: number
}

export default function PiercingGallery() {
  const [piercings, setPiercings] = useState<Piercing[]>([])

  useEffect(() => {
    fetch(`${BACKEND}/api/piercing/publicos/`)
      .then(res => res.json())
      .then(data => setPiercings(data))
      .catch(err => console.error("Error cargando piercings:", err))
  }, [])

  return (
    <section className="piercing-gallery">
      <div className="section-container">
        <div className="gallery-grid">
          {piercings.map((piercing) => (
            <div key={piercing.id} className="gallery-card card card-hover">
              <div className="gallery-image-container">
                <Image
                  src={piercing.foto || "/placeholder.svg"}
                  alt={piercing.nombre}
                  fill
                  className="gallery-image"
                />
              </div>
              <div className="gallery-content">
                <h3 className="gallery-item-title">{piercing.nombre}</h3>
                <p className="gallery-item-location">Ubicación: {piercing.ubi}</p>
                <p className="gallery-item-location">Precio: {piercing.precio} CUP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
