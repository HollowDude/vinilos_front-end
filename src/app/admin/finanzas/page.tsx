"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, Download } from "lucide-react"
import "./finanzas.css"

interface ReporteFinanciero {
  id: number
  fecha: string
  hora: string
  tipo: "ingreso" | "gasto"
  concepto: string
  monto: number
  usuario: string
  detalles?: {
    id: number
    descripcion: string
    valor: number
  }[]
}

export default function FinanzasAdmin() {
  const [reportes, setReportes] = useState<ReporteFinanciero[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        // En un caso real, esto sería una llamada a la API
        // const response = await fetch('/api/finanzas/reportes')
        // const data = await response.json()
        // setReportes(data)

        // Simulamos datos para el ejemplo
        setTimeout(() => {
          setReportes([
            {
              id: 1,
              fecha: "2023-05-15",
              hora: "10:30:45",
              tipo: "ingreso",
              concepto: "Venta de productos",
              monto: 1250.5,
              usuario: "Vendedor",
              detalles: [
                { id: 1, descripcion: "Piercing de Titanio x1", valor: 25.99 },
                { id: 2, descripcion: "Expansor de Madera x2", valor: 39.98 },
                { id: 3, descripcion: "Servicio de tatuaje", valor: 1184.53 },
              ],
            },
            {
              id: 2,
              fecha: "2023-05-16",
              hora: "14:22:10",
              tipo: "gasto",
              concepto: "Compra de materiales",
              monto: 450.75,
              usuario: "Admin",
              detalles: [
                { id: 1, descripcion: "Tintas variadas", valor: 250.5 },
                { id: 2, descripcion: "Agujas y material desechable", valor: 200.25 },
              ],
            },
            {
              id: 3,
              fecha: "2023-05-18",
              hora: "09:15:30",
              tipo: "ingreso",
              concepto: "Servicio de tatuajes",
              monto: 2800.0,
              usuario: "Carlos Mendez",
              detalles: [
                { id: 1, descripcion: "Tatuaje Dragón Japonés", valor: 1500.0 },
                { id: 2, descripcion: "Tatuaje Mandala Geométrico", valor: 1300.0 },
              ],
            },
            {
              id: 4,
              fecha: "2023-05-20",
              hora: "16:45:22",
              tipo: "gasto",
              concepto: "Pago de alquiler",
              monto: 1200.0,
              usuario: "Admin",
            },
            {
              id: 5,
              fecha: "2023-05-22",
              hora: "11:30:15",
              tipo: "ingreso",
              concepto: "Servicio de piercings",
              monto: 950.25,
              usuario: "Ana Martínez",
              detalles: [
                { id: 1, descripcion: "Colocación de Septum", valor: 350.0 },
                { id: 2, descripcion: "Colocación de Industrial", valor: 400.25 },
                { id: 3, descripcion: "Venta de productos de cuidado", valor: 200.0 },
              ],
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar reportes financieros:", err)
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
      const reporteDate = new Date(reporte.fecha)
      const start = new Date(startDate)
      const end = new Date(endDate)
      matchesFecha = reporteDate >= start && reporteDate <= end
    }

    return matchesSearch && matchesTipo && matchesFecha
  })

  // Calcular totales
  const totalIngresos = filteredReportes
    .filter((reporte) => reporte.tipo === "ingreso")
    .reduce((sum, reporte) => sum + reporte.monto, 0)

  const totalGastos = filteredReportes
    .filter((reporte) => reporte.tipo === "gasto")
    .reduce((sum, reporte) => sum + reporte.monto, 0)

  const balance = totalIngresos - totalGastos

  const handleExportPDF = () => {
    alert("Exportando a PDF...")
    // En un caso real, esto sería una llamada a la API para generar el PDF
    // window.open('/api/finanzas/export-pdf', '_blank')
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

        <div className={`summary-card CUP{balance >= 0 ? "summary-positivo" : "summary-negativo"}`}>
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
          <select className="filter-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
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
              <div key={reporte.id} className={`reporte-card tipo-CUP{reporte.tipo}`}>
                <div className="reporte-header">
                  <div className="reporte-info">
                    <span className={`reporte-tipo tipo-CUP{reporte.tipo}`}>
                      {reporte.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                    </span>
                    <h3 className="reporte-concepto">{reporte.concepto}</h3>
                    <span className="reporte-fecha">
                      {new Date(reporte.fecha).toLocaleDateString("es-ES")} - {reporte.hora}
                    </span>
                  </div>
                  <div className="reporte-monto">
                    <span className={`monto-valor CUP{reporte.tipo === "ingreso" ? "monto-ingreso" : "monto-gasto"}`}>
                      {reporte.tipo === "ingreso" ? "+" : "-"}
                      {reporte.monto.toLocaleString("es-ES")} CUP
                    </span>
                    <span className="reporte-usuario">Usuario: {reporte.usuario}</span>
                  </div>
                </div>

                {reporte.detalles && reporte.detalles.length > 0 && (
                  <div className="reporte-detalles">
                    <h4 className="detalles-titulo">Detalles</h4>
                    <table className="detalles-tabla">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reporte.detalles.map((detalle) => (
                          <tr key={detalle.id}>
                            <td>{detalle.descripcion}</td>
                            <td className="detalle-valor">{detalle.valor.toFixed(2)} CUP</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="detalle-total">Total</td>
                          <td className="detalle-total-valor">{reporte.monto.toFixed(2)} CUP</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
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

