"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, AlertTriangle } from "lucide-react"
import "../finanzas/finanzas.css"
import "./inventario.css"
import { BACKEND } from "@/src/types/commons"

interface Producto {
  nombre: string
  cat: string
  stock: number
  stock_minimo: number
  precio_compra_total: number | null
}

interface InventarioResumen {
  total_productos: number
  valor_inventario: number
  productos_stock_bajo: number
}

export default function InventarioAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [resumen, setResumen]     = useState<InventarioResumen>({
    total_productos:     0,
    valor_inventario:    0,
    productos_stock_bajo: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm]       = useState("")
  const [filterCategoria, setFilterCategoria] = useState("")
  const [filterStock, setFilterStock]     = useState("")

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const [resProd, resSum] = await Promise.all([
          fetch(`${BACKEND}/api/producto/resumen/`, { credentials: "include" }),
          fetch(`${BACKEND}/api/producto/inventario/`, { credentials: "include" }),
        ])

        if (!resProd.ok || !resSum.ok) throw new Error("Error cargando inventario")

        const dataProd: Producto[]       = await resProd.json()
        const dataRes: InventarioResumen = await resSum.json()

        setProductos(dataProd)
        setResumen(dataRes)
      } catch (err) {
        console.error("Error al cargar inventario:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventario()
  }, [])

  const filteredProductos = productos.filter((p) => {
    const matchesSearch    = p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === "" || p.cat === filterCategoria

    let matchesStock = true
    if (filterStock === "bajo") {
      matchesStock = p.stock < p.stock_minimo
    } else if (filterStock === "normal") {
      matchesStock = p.stock >= p.stock_minimo
    }

    return matchesSearch && matchesCategoria && matchesStock
  })

  const categorias = Array.from(new Set(productos.map((p) => p.cat)))



  return (
    <div className="inventario-admin">
      <div className="inventario-header">
        <h1 className="inventario-title">Inventario</h1>
      </div>

      <div className="inventario-summary">
        <div className="summary-card">
          <h3 className="summary-title">Total Productos</h3>
          <p className="summary-value">{resumen.total_productos}</p>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Valor del Inventario</h3>
          <p className="summary-value">{resumen.valor_inventario.toLocaleString("es-ES")} CUP</p>
        </div>

        <div className={`summary-card ${resumen.productos_stock_bajo > 0 ? "summary-warning" : ""}`}>
          <h3 className="summary-title">Productos con Stock Bajo</h3>
          <p className="summary-value">
            {resumen.productos_stock_bajo}
            {resumen.productos_stock_bajo > 0 && <AlertTriangle size={16} className="warning-icon" />}
          </p>
        </div>
      </div>

      <div className="inventario-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
          >
            <option value="">Todos los niveles de stock</option>
            <option value="bajo">Stock bajo</option>
            <option value="normal">Stock normal</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="inventario-loading">
          <div className="loading-spinner"></div>
          <p>Cargando inventario...</p>
        </div>
      ) : (
        <div className="inventario-table-container">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Stock Mínimo</th>
                <th>Precio Compra Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.length > 0 ? (
                filteredProductos.map((p, i) => {
                  const low = p.stock < p.stock_minimo
                  return (
                    <tr key={i} className={low ? "row-warning" : ""}>
                      <td>{p.nombre}</td>
                      <td>{p.cat}</td>
                      <td className={low ? "stock-bajo" : ""}>
                        {p.stock}
                        {low && <AlertTriangle size={16} className="warning-icon" />}
                      </td>
                      <td>{p.stock_minimo}</td>
                      <td>{(p.precio_compra_total ?? 0).toFixed(2)} CUP</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="inventario-empty">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}