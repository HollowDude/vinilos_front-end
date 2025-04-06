import Image from "next/image"
import Link from "next/link"
import "./hero.css"

export default function Hero() {
  return (
    <div className="hero">
      {/* Imagen de fondo */}
      <div className="hero-background">
        <Image
          src="/banner.png?height=1080&width=1920"
          alt="Estudio de tatuajes"
          fill
          priority
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Contenido */}
      <div className="hero-content">
        <h1 className="hero-title">ViniloStudio</h1>
        <p className="hero-description">Arte en tu piel. Estudio de tatuajes y piercings en tu universidad.</p>
        <div className="hero-buttons">
          <Link href="/tattoos" className="button button-primary hero-button">
            Ver Trabajos
          </Link>
          <Link href="#contact" className="button button-outline hero-button-outline">
            Contactar
          </Link>
        </div>
      </div>
    </div>
  )
}

