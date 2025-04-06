import TattooGallery from "@/src/components/tattoo-gallery"
import Footer from "@/src/components/footer"
import "./tattoos.css"

export const metadata = {
  title: "Tatuajes - ViniloStudio",
  description: "Galería de tatuajes realizados por nuestros artistas",
}

export default function TattoosPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tatuajes Realizados</h1>
        <p className="page-description">
          Explora nuestra galería de tatuajes realizados por nuestros artistas.
        </p>
      </div>
      <TattooGallery />
      <Footer />
    </main>
  )
}

