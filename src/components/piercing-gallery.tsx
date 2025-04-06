import Image from "next/image"
import "./piercing-gallery.css"

// Datos de prueba
const piercings = [
  {
    id: 1,
    title: "Septum",
    image: "/placeholder.svg?height=400&width=300",
    location: "Nariz",
  },
  {
    id: 2,
    title: "Industrial",
    image: "/placeholder.svg?height=400&width=300",
    location: "Oreja",
  },
  {
    id: 3,
    title: "Labret",
    image: "/placeholder.svg?height=400&width=300",
    location: "Labio",
  },
  {
    id: 4,
    title: "Helix",
    image: "/placeholder.svg?height=400&width=300",
    location: "Oreja",
  },
]

export default function PiercingGallery() {
  return (
    <section className="piercing-gallery">
      <div className="section-container">
        <div className="gallery-grid">
          {piercings.map((piercing) => (
            <div key={piercing.id} className="gallery-card card card-hover">
              <div className="gallery-image-container">
                <Image src={piercing.image || "/placeholder.svg"} alt={piercing.title} fill className="gallery-image" />
              </div>
              <div className="gallery-content">
                <h3 className="gallery-item-title">{piercing.title}</h3>
                <p className="gallery-item-location">Ubicación: {piercing.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

