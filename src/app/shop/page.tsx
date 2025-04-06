import Shop from "@/src/components/shop"
import Footer from "@/src/components/footer"
import "@/src/app/(main)/tattoos/tattoos.css"
import Header from "@/src/components/header"

export const metadata = {
  title: "Tienda - ViniloStudio",
  description: "Productos de calidad para piercings y cuidado de tatuajes",
}

export default function ShopPage() {
  return (
    <main className="page-container">
      <Header />
      <div className="page-header">
        <h1 className="page-title">Nuestra Tienda</h1>
        <p className="page-description">Encuentra piercings de calidad y productos para el cuidado de tus tatuajes.</p>
      </div>
      <Shop />
      <Footer />
    </main>
  )
}

