"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PerforadorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de piercings
    router.push("/admin/piercings")
  }, [router])

  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Redirigiendo...</p>
    </div>
  )
}

