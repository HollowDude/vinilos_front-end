import Image from "next/image"
import "./about-us.css"

// Datos de prueba
const team = [
  {
    id: 1,
    name: "Xavier Verdecie Ramos",
    role: "Tatuador",
    image: "/5156823351359024535.jpg?height=400&width=300",
    bio: "Tatuador especializado en blackworks y grises, detallista, perfeccionista y pulcro con cada una de sus obras.",
  },
  {
    id: 2,
    name: "Marinsey Elvira Rivero",
    role: "Perforadora",
    image: "/IMG_9752.jpg?height=400&width=300",
    bio: "Perforadora con experiencia, trabaja con la mayor sanidad y cuidado posible con sus clientes",
  },
]

export default function AboutUs() {
  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <h2 className="section-title">¿Quiénes somos?</h2>

        <div className="about-description">
          <p className="about-text">
            En ViniloStudio nos dedicamos al arte corporal desde hace 2 años. Nuestro equipo de artistas está comprometido
            con la calidad, la higiene y la satisfacción del cliente.
          </p>
          <p className="about-text">
            Utilizamos materiales de primera calidad y seguimos estrictos protocolos de esterilización para garantizar
            la seguridad de todos nuestros clientes.
          </p>
        </div>

        <h3 className="team-title">Nuestro Equipo</h3>
        <div className="team-grid">
          {team.map((member) => (
            <div key={member.id} className="team-card card card-hover">
              <div className="team-image-container">
                <Image src={member.image} alt={member.name} fill className="team-image" />
              </div>
              <div className="team-content">
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

