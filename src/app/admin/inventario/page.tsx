"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, AlertTriangle } from "lucide-react"
import "../finanzas/finanzas.css"
import "./inventario.css"

interface Producto {
  id: number
  nombre: string
  categoria: string
  stock: number
  stock_minimo: number
  precio_compra: number
  precio_venta: number
  proveedor: string
}

interface ResumenCategoria {
  categoria: string
  cantidad: number
  valor: number
  productos: number
}

export default function InventarioAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("")
  const [filterStock, setFilterStock] = useState("")
  const [resumenCategorias, setResumenCategorias] = useState<ResumenCategoria[]>([])

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // En un caso real, esto sería una llamada a la API
        // const response = await fetch('/api/inventario')
        // const data = await response.json()
        // setProductos(data)

        // Simulamos datos para el ejemplo
        setTimeout(() => {
          const productosData = [
            {
              id: 1,
              nombre: "Piercing de Titanio",
              categoria: "Piercings",
              stock: 15,
              stock_minimo: 5,
              precio_compra: 12.5,
              precio_venta: 25.99,
              proveedor: "Suministros Pro",
            },
            {
              id: 2,
              nombre: "Expansor de Madera",
              categoria: "Expansores",
              stock: 3,
              stock_minimo: 5,
              precio_compra: 8.75,
              precio_venta: 19.99,
              proveedor: "Suministros Pro",
            },
            {
              id: 3,
              nombre: "Crema para Cuidado",
              categoria: "Cuidados",
              stock: 20,
              stock_minimo: 10,
              precio_compra: 5.25,
              precio_venta: 12.5,
              proveedor: "Farmacia Tattoo",
            },
            {
              id: 4,
              nombre: "Piercing de Acero",
              categoria: "Piercings",
              stock: 12,
              stock_minimo: 8,
              precio_compra: 7.5,
              precio_venta: 15.99,
              proveedor: "Suministros Pro",
            },
            {
              id: 5,
              nombre: "Tinta Negra Premium",
              categoria: "Tintas",
              stock: 2,
              stock_minimo: 5,
              precio_compra: 15.0,
              precio_venta: 29.99,
              proveedor: "Tintas Profesionales",
            },
            {
              id: 6,
              nombre: "Kit de Agujas Variadas",
              categoria: "Agujas",
              stock: 7,
              stock_minimo: 3,
              precio_compra: 22.75,
              precio_venta: 45.5,
              proveedor: "Suministros Pro",
            },
            {
              id: 7,
              nombre: "Tinta Roja Premium",
              categoria: "Tintas",
              stock: 4,
              stock_minimo: 5,
              precio_compra: 17.5,
              precio_venta: 32.99,
              proveedor: "Tintas Profesionales",
            },
            {
              id: 8,
              nombre: "Tinta Azul Premium",
              categoria: "Tintas",
              stock: 6,
              stock_minimo: 5,
              precio_compra: 17.5,
              precio_venta: 32.99,
              proveedor: "Tintas Profesionales",
            },
            {
              id: 9,
              nombre: "Guantes de Látex (Caja)",
              categoria: "Protección",
              stock: 15,
              stock_minimo: 10,
              precio_compra: 8.0,
              precio_venta: 12.0,
              proveedor: "Farmacia Tattoo",
            },
            {
              id: 10,
              nombre: "Mascarillas (Caja)",
              categoria: "Protección",
              stock: 8,
              stock_minimo: 5,
              precio_compra: 10.0,
              precio_venta: 15.0,
              proveedor: "Farmacia Tattoo",
            },
          ]

          setProductos(productosData)

          // Generar resumen por categorías
          const categorias = [...new Set(productosData.map((p) => p.categoria))]
          const resumen = categorias.map((categoria) => {
            const productosFiltrados = productosData.filter((p) => p.categoria === categoria)
            return {
              categoria,
              cantidad: productosFiltrados.reduce((sum, p) => sum + p.stock, 0),
              valor: productosFiltrados.reduce((sum, p) => sum + p.precio_compra * p.stock, 0),
              productos: productosFiltrados.length,
            }
          })

          setResumenCategorias(resumen)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar inventario:", err)
        setIsLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === "" || producto.categoria === filterCategoria

    let matchesStock = true
    if (filterStock === "bajo") {
      matchesStock = producto.stock < producto.stock_minimo
    } else if (filterStock === "normal") {
      matchesStock = producto.stock >= producto.stock_minimo
    }

    return matchesSearch && matchesCategoria && matchesStock
  })

  const categorias = [...new Set(productos.map((producto) => producto.categoria))]

  const productosStockBajo = productos.filter((producto) => producto.stock < producto.stock_minimo).length

  const valorInventario = productos.reduce((sum, producto) => sum + producto.precio_compra * producto.stock, 0)

  const handleExportPDF = () => {
    alert("Exportando a PDF...")
    // En un caso real, esto sería una llamada a la API para generar el PDF
  }

  return (
    <div className="inventario-admin">
      <div className="inventario-header">
        <h1 className="inventario-title">Inventario</h1>
        <button className="button button-primary" onClick={handleExportPDF}>
          <Download size={16} />
          <span>Exportar PDF</span>
        </button>
      </div>

      <div className="inventario-summary">
        <div className="summary-card">
          <h3 className="summary-title">Total Productos</h3>
          <p className="summary-value">{productos.length}</p>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Valor del Inventario</h3>
          <p className="summary-value">{valorInventario.toLocaleString("es-ES")} CUP</p>
        </div>

        <div className={`summary-card CUP{productosStockBajo > 0 ? "summary-warning" : ""}`}>
          <h3 className="summary-title">Productos con Stock Bajo</h3>
          <p className="summary-value">
            {productosStockBajo}
            {productosStockBajo > 0 && <AlertTriangle size={16} className="warning-icon" />}
          </p>
        </div>
      </div>

      <div className="inventario-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o proveedor..."
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
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select className="filter-select" value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
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
                <th>Precio Compra</th>
                <th>Precio Venta</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.length > 0 ? (
                filteredProductos.map((producto) => {
                  const stockBajo = producto.stock < producto.stock_minimo

                  return (
                    <tr key={producto.id} className={stockBajo ? "row-warning" : ""}>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td className={stockBajo ? "stock-bajo" : ""}>
                        {producto.stock}
                        {stockBajo && <AlertTriangle size={16} className="warning-icon" />}
                      </td>
                      <td>{producto.stock_minimo}</td>
                      <td>{producto.precio_compra.toFixed(2)} CUP</td>
                      <td>{producto.precio_venta.toFixed(2)} CUP</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="inventario-empty">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen de inventario por categorías */}
      <div className="inventario-resumen">
        <h2 className="resumen-title">Resumen de Inventario por Categorías</h2>

        {isLoading ? (
          <div className="inventario-loading">
            <div className="loading-spinner"></div>
            <p>Cargando resumen...</p>
          </div>
        ) : (
          <div className="resumen-grid">
            {resumenCategorias.map((categoria) => (
              <div key={categoria.categoria} className="resumen-card">
                <h3 className="resumen-categoria">{categoria.categoria}</h3>
                <div className="resumen-stats">
                  <div className="resumen-stat">
                    <span className="resumen-label">Productos:</span>
                    <span className="resumen-value">{categoria.productos}</span>
                  </div>
                  <div className="resumen-stat">
                    <span className="resumen-label">Unidades:</span>
                    <span className="resumen-value">{categoria.cantidad}</span>
                  </div>
                  <div className="resumen-stat">
                    <span className="resumen-label">Valor:</span>
                    <span className="resumen-value">{categoria.valor.toFixed(2)} CUP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="resumen-total">
          <h3 className="resumen-total-title">Resumen Total</h3>
          <div className="resumen-total-stats">
            <div className="resumen-total-stat">
              <span className="resumen-total-label">Total Categorías:</span>
              <span className="resumen-total-value">{resumenCategorias.length}</span>
            </div>
            <div className="resumen-total-stat">
              <span className="resumen-total-label">Total Productos:</span>
              <span className="resumen-total-value">{productos.length}</span>
            </div>
            <div className="resumen-total-stat">
              <span className="resumen-total-label">Total Unidades:</span>
              <span className="resumen-total-value">
                {resumenCategorias.reduce((sum, cat) => sum + cat.cantidad, 0)}
              </span>
            </div>
            <div className="resumen-total-stat">
              <span className="resumen-total-label">Valor Total:</span>
              <span className="resumen-total-value">{valorInventario.toLocaleString("es-ES")} CUP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

