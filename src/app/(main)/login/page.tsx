"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "./login.css"
import { BACKEND } from "@/src/types/commons"

export default function LoginPage() {
  const [username, setUsername]   = useState<string>("")
  const [password, setPassword]   = useState<string>("")
  const [recordar, setRecordar]   = useState<boolean>(false)
  const [error, setError]         = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router                    = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`${BACKEND}/api/auth/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember: recordar })
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error((body as { detail?: string }).detail || 'Credenciales inválidas')
      }

      router.push("/admin/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
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
