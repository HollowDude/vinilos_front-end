import Image from "next/image"
import "./shop.css"

const scheduleAppointmentLink = "https://wa.me/+5358622909?text=Hola,%20me%20gustaría%20agendar%20una%20cita%20para%20un%20piercing.";

// Datos de prueba
const products = [
  {
    id: 1,
    name: "Piercing de Titanio",
    precio: 25.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Piercings",
  },
  {
    id: 2,
    name: "Expansor de Madera",
    precio: 19.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Expansores",
  },
  {
    id: 3,
    name: "Crema para Cuidado",
    precio: 12.5,
    image: "/placeholder.svg?height=400&width=300",
    category: "Cuidados",
  },
  {
    id: 4,
    name: "Piercing de Acero",
    precio: 15.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Piercings",
  },
]

export default function Shop() {
  return (
    <section className="shop-section">
      <div className="section-container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card card card-hover">
              <div className="product-image-container">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="product-image" />
              </div>
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">Categoría: {product.category}</p>
                <p className="product-price">{product.precio.toFixed(2)} CUP</p>
              </div>
              <div className="product-footer">
                <a className="button button-outline product-button" href={scheduleAppointmentLink}>Contactar para Comprar</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

