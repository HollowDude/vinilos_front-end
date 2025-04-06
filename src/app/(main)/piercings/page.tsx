import PiercingGallery from "@/src/components/piercing-gallery"
import Footer from "@/src/components/footer"
import "@/src/app/(main)/tattoos/tattoos.css"

export const metadata = {
  title: "Piercings - ViniloStudio",
  description: "Galería de piercings realizados por nuestros profesionales",
}

export default function PiercingsPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Nuestros Piercings</h1>
        <p className="page-description">
          Descubre nuestra colección de piercings realizados por profesionales certificados.
        </p>
      </div>
      <PiercingGallery />
      <Footer />
    </main>
  )
}

