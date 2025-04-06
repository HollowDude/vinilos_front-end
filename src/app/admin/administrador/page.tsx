"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdministradorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de finanzas
    router.push("/admin/finanzas")
  }, [router])

  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Redirigiendo...</p>
    </div>
  )
}

