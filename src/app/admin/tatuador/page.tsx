"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TatuadorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de tatuajes
    router.push("/admin/tatuajes")
  }, [router])

  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Redirigiendo...</p>
    </div>
  )
}

