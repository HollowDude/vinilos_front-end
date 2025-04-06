"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "./login.css"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [recordar, setRecordar] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Mas o menos asi seria con la api real
      /*
      // Obtener el CSRF token primero (si es necesario)
      const csrfResponse = await fetch('/api/csrf-token', { 
        method: 'GET',
        credentials: 'include'
      });
      
      // Realizar la solicitud de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          recordar
        })
      })
      
      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }
      
      const data = await response.json()
      */

      // Simulamos la respuesta para pruebas
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay

      // Credenciales de prueba
      const credencialesPrueba = [
        { username: "tatuador1", password: "123456", tipo_user: "tatuador" },
        { username: "perforador1", password: "123456", tipo_user: "perforador" },
        { username: "admin", password: "123456", tipo_user: "administrador" },
      ]

      const usuario = credencialesPrueba.find((u) => u.username === username && u.password === password)

      if (!usuario) {
        throw new Error("Credenciales inválidas")
      }

      // Redireccionar según el tipo de usuario
      switch (usuario.tipo_user) {
        case "tatuador":
          router.push("/admin/tatuador")
          break
        case "perforador":
          router.push("/admin/perforador")
          break
        case "administrador":
          router.push("/admin/administrador")
          break
        default:
          router.push("/admin/dashboard")
      }
    } catch (err) {
      console.error("Error de login:", err)
      setError("Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-description">Ingresa tus credenciales para acceder al panel de administración</p>
        </div>
        <div className="login-content">
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group-checkbox">
              <input
                id="recordar"
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="recordar" className="checkbox-label">
                Recordar sesión
              </label>
            </div>
            <button
              type="submit"
              className={`button button-primary login-button ${isLoading ? "button-loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
        <div className="login-footer">
          <Link href="/" className="back-link">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  )
}

