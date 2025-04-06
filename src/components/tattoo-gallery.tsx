import Image from "next/image"
import "./tattoo-gallery.css"

const tattoos = [
  {
    id: 1,
    title: "Dragón Japonés",
    artist: "Carlos Mendez",
    image: "/placeholder.svg?height=400&width=300",
    style: "Tradicional Japonés",
    precio: "1500"
  },
  {
    id: 2,
    title: "Mandala Geométrico",
    artist: "Laura Sánchez",
    image: "/placeholder.svg?height=400&width=300",
    style: "Geométrico",
    precio: "1000"
  },
  {
    id: 3,
    title: "Retrato Realista",
    artist: "Miguel Torres",
    image: "/placeholder.svg?height=400&width=300",
    style: "Realismo",
    precio: "2500"
  },
  {
    id: 4,
    title: "Old School Anchor",
    artist: "Carlos Mendez",
    image: "/placeholder.svg?height=400&width=300",
    style: "Old School",
    precio: "2000"
  },
]

export default function TattooGallery() {
  return (
    <section className="tattoo-gallery">
      <div className="section-container">
        <div className="gallery-grid">
          {tattoos.map((tattoo) => (
            <div key={tattoo.id} className="gallery-card card card-hover">
              <div className="gallery-image-container">
                <Image src={tattoo.image || "/placeholder.svg"} alt={tattoo.title} fill className="gallery-image" />
              </div>
              <div className="gallery-content">
                <h3 className="gallery-item-title">{tattoo.title}</h3>
                <h3 className="gallery-item-title">Precio: {tattoo.precio + "CUP"}</h3>
                <p className="gallery-item-artist">Artista: {tattoo.artist}</p>
                <p className="gallery-item-style">Estilo: {tattoo.style}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

