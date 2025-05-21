"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import "./tattoo-gallery.css"
import "./shop.css"
import { BACKEND } from "../types/commons"

interface Tattoo {
  id: number
  nombre: string
  estilo: string
  precio: number
  foto: string | null
  artista: string
}

export default function TattooGallery() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BACKEND}/api/tattoo/publicos/`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data: Tattoo[]) => {
        setTattoos(data)
      })
      .catch((err) => {
        console.error(err)
        setError("No se pudieron cargar los tatuajes.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando tatuajes…</p>
  if (error)   return <p className="error">{error}</p>

  const scheduleAppointmentLink =
    "https://wa.me/+5358228400?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20hacerme%20un%20tatuaje."


  return (
    <section className="tattoo-gallery">
      <div className="section-container">
        <div className="gallery-grid">
          {tattoos.map((tattoo) => (
            <div key={tattoo.id} className="gallery-card card card-hover">
              <div className="gallery-image-container">
                <Image
                  src={tattoo.foto || "/placeholder.svg"}
                  alt={tattoo.nombre}
                  fill
                  className="gallery-image"
                />
              </div>
              <div className="gallery-content">
                <h3 className="gallery-item-title">{tattoo.nombre}</h3>
                <h3 className="gallery-item-title">
                  Precio: {tattoo.precio} CUP
                </h3>
                <p className="gallery-item-artist">Artista: {tattoo.artista}</p>
                <p className="gallery-item-style">Estilo: {tattoo.estilo}</p>
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
