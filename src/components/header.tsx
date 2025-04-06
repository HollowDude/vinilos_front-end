"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon } from "lucide-react"
import "./header.css"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <Link href="/" className="logo-link">
              ViniloStudio
            </Link>
          </div>

          <div className="header-mobile-menu">
            <button
              className="button button-ghost theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="button button-ghost menu-toggle" onClick={() => setIsOpen(true)}>
              <Menu className="icon" />
            </button>
          </div>

          <nav className="header-nav">
            <Link href="/tattoos" className="nav-link">
              Tatuajes
            </Link>
            <Link href="/piercings" className="nav-link">
              Piercings
            </Link>
            <Link href="/shop" className="nav-link">
              Tienda
            </Link>
            <Link href="/#about" className="nav-link">
            ¿Quiénes somos?
            </Link>
          </nav>

          <div className="header-actions">
            <button
              className="button button-ghost theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link href="/login" className="button button-primary login-button">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-container">
            <div className="mobile-menu-header">
              <div>
                <span className="mobile-logo">ViniloStudio</span>
              </div>
              <button className="button button-ghost close-button" onClick={() => setIsOpen(false)}>
                <X className="icon" />
              </button>
            </div>
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                <Link href="/tattoos" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                  Tatuajes
                </Link>
                <Link href="/piercings" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                  Piercings
                </Link>
                <Link href="/shop" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                  Tienda
                </Link>
                <Link href="/#about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                  Quiénes somos
                </Link>
                <Link
                  href="/login"
                  className="button button-primary mobile-login-button"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

