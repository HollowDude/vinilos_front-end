'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import "./piercing-gallery.css"
import "./shop.css"
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

  const scheduleAppointmentLink =
    "https://wa.me/+5358622909?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20ponerme%20ponerme%20un%20piercing."

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
              <div className="product-footer">
                <a
                  className="button button-outline product-button"
                  href={scheduleAppointmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar para agendar cita
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
