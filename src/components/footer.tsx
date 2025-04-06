import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"
import "./footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-info">
            <h3 className="footer-title">ViniloStudio</h3>
            <p className="footer-description">
              Estudio de tatuajes y piercings aqui mismo, en tu universidad. Hacemos de tu cuerpo una obra de arte.
            </p>
            <div className="footer-social">
              <Link href="#" className="social-link">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="social-link">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>

          <div className="footer-links-container">
            <h4 className="footer-links-title">Enlaces</h4>
            <ul className="footer-links">
              <li>
                <Link href="/tattoos" className="footer-link">
                  Tatuajes
                </Link>
              </li>
              <li>
                <Link href="/piercings" className="footer-link">
                  Piercings
                </Link>
              </li>
              <li>
                <Link href="/shop" className="footer-link">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/#about" className="footer-link">
                ¿Quiénes somos?
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-contact-title">Contacto</h4>
            <address className="footer-address">
              <p>Universidad de Las Ciencias Informaticas</p>
              <p>Apto 83-105</p>
              <p className="footer-phone">
                <a href="tel:+34600000000" className="footer-contact-link">
                  +53 5 8622909
                </a>
              </p>
              <p>
                <a href="mailto:info@vinilostudio.com" className="footer-contact-link">
                  riveromarisney@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} ViniloStudio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

