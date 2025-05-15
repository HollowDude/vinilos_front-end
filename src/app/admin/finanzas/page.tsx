"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, Download } from "lucide-react"
import "./finanzas.css"

interface ReporteFinanciero {
  id: number
  fecha: string    // "YYYY-MM-DD"
  hora: string     // "HH:MM:SS"
  tipo: "ingreso" | "gasto"
  concepto: string
  monto: number
  usuario: string  // Lo dejamos vacío (no lo provee la API)
  detalles?: never[]  // tu API no expone detalles
}

export default function FinanzasAdmin() {
  const [reportes, setReportes] = useState<ReporteFinanciero[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState<"" | "ingreso" | "gasto">("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/reporte_finanza/`, {
          credentials: "include"
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        // data.results si la vista viene paginada, o data si lista plana
        const items = Array.isArray(data) ? data : data.results
        const mapped = items.map((r: any) => {
          const [fecha, hora] = r.date.split("T")
          return {
            id: r.id,
            fecha,
            hora: hora.split(".")[0],
            tipo: r.transaction_type,
            concepto: r.description,
            monto: parseFloat(r.amount),
            usuario: "",      // la API no lo proporciona
          } as ReporteFinanciero
        })
        setReportes(mapped)
      } catch (err) {
        console.error("Error al cargar reportes financieros:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportes()
  }, [])

  // Filtrar reportes según los criterios de búsqueda
  const filteredReportes = reportes.filter((reporte) => {
    const matchesSearch =
      reporte.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.usuario.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = filterTipo === "" || reporte.tipo === filterTipo

    let matchesFecha = true
    if (startDate && endDate) {
      const rd = new Date(reporte.fecha)
      const sd = new Date(startDate)
      const ed = new Date(endDate)
      matchesFecha = rd >= sd && rd <= ed
    }

    return matchesSearch && matchesTipo && matchesFecha
  })

  // Calcular totales
  const totalIngresos = filteredReportes
    .filter((r) => r.tipo === "ingreso")
    .reduce((sum, r) => sum + r.monto, 0)

  const totalGastos = filteredReportes
    .filter((r) => r.tipo === "gasto")
    .reduce((sum, r) => sum + r.monto, 0)

  const balance = totalIngresos - totalGastos

  const handleExportPDF = () => {
    alert("Exportando a PDF...")
    // window.open(`${BACKEND}/api/finanzas/export-pdf`, "_blank")
  }

  return (
    <div className="finanzas-admin">
      <div className="finanzas-header">
        <h1 className="finanzas-title">Reportes Financieros</h1>
        <button className="button button-primary" onClick={handleExportPDF}>
          <Download size={16} />
          <span>Exportar PDF</span>
        </button>
      </div>

      <div className="finanzas-summary">
        <div className="summary-card summary-ingresos">
          <h3 className="summary-title">Total Ingresos</h3>
          <p className="summary-value">{totalIngresos.toLocaleString("es-ES")} CUP</p>
        </div>

        <div className="summary-card summary-gastos">
          <h3 className="summary-title">Total Gastos</h3>
          <p className="summary-value">{totalGastos.toLocaleString("es-ES")} CUP</p>
        </div>

        <div className={`summary-card ${balance >= 0 ? "summary-positivo" : "summary-negativo"}`}>
          <h3 className="summary-title">Balance</h3>
          <p className="summary-value">{balance.toLocaleString("es-ES")} CUP</p>
        </div>
      </div>

      <div className="finanzas-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por concepto o usuario..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as any)}
          >
            <option value="">Todos los tipos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>

        <div className="date-filter">
          <div className="date-input-container">
            <Calendar size={18} className="date-icon" />
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Fecha inicio"
            />
          </div>
          <span className="date-separator">a</span>
          <div className="date-input-container">
            <Calendar size={18} className="date-icon" />
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Fecha fin"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="finanzas-loading">
          <div className="loading-spinner"></div>
          <p>Cargando reportes financieros...</p>
        </div>
      ) : (
        <div className="reportes-list">
          {filteredReportes.length > 0 ? (
            filteredReportes.map((reporte) => (
              <div key={reporte.id} className={`reporte-card tipo-${reporte.tipo}`}>
                <div className="reporte-header">
                  <div className="reporte-info">
                    <span className={`reporte-tipo tipo-${reporte.tipo}`}>
                      {reporte.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                    </span>
                    <h3 className="reporte-concepto">{reporte.concepto}</h3>
                    <span className="reporte-fecha">
                      {new Date(reporte.fecha).toLocaleDateString("es-ES")} - {reporte.hora}
                    </span>
                  </div>
                  <div className="reporte-monto">
                    <span className={`monto-valor ${reporte.tipo === "ingreso" ? "monto-ingreso" : "monto-gasto"}`}>
                      {reporte.tipo === "ingreso" ? "+" : "-"}
                      {reporte.monto.toLocaleString("es-ES")} CUP
                    </span>
                    <span className="reporte-usuario">Usuario: {reporte.usuario}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="reportes-empty">No se encontraron reportes financieros</div>
          )}
        </div>
      )}
    </div>
  )
}
