"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Plus } from "lucide-react"
import "./ventas.css"

interface Venta {
  id: number
  fecha: string
  producto: string
  cantidad: number
  precio_unitario: number
  total: number
  cliente: string
}

export default function VentasAdmin() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [newVenta, setNewVenta] = useState<Venta | null>(null)

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setTimeout(() => {
          setVentas([
            {
              id: 1,
              fecha: "2023-05-15",
              producto: "Piercing de Titanio",
              cantidad: 1,
              precio_unitario: 25.99,
              total: 25.99,
              cliente: "Juan Pérez",
            },
            {
              id: 2,
              fecha: "2023-05-16",
              producto: "Expansor de Madera",
              cantidad: 2,
              precio_unitario: 19.99,
              total: 39.98,
              cliente: "María López",
            },
            {
              id: 3,
              fecha: "2023-05-17",
              producto: "Crema para Cuidado",
              cantidad: 1,
              precio_unitario: 12.5,
              total: 12.5,
              cliente: "Carlos Rodríguez",
            },
            {
              id: 4,
              fecha: "2023-05-18",
              producto: "Piercing de Acero",
              cantidad: 3,
              precio_unitario: 15.99,
              total: 47.97,
              cliente: "Ana Martínez",
            },
            {
              id: 5,
              fecha: "2023-05-19",
              producto: "Tinta Negra Premium",
              cantidad: 1,
              precio_unitario: 29.99,
              total: 29.99,
              cliente: "Pedro Sánchez",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar ventas:", err)
        setIsLoading(false)
      }
    }

    fetchVentas()
  }, [])

  const filteredVentas = ventas.filter((venta) => {
    const matchesSearch =
      venta.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFecha = true
    if (startDate && endDate) {
      const ventaDate = new Date(venta.fecha)
      const start = new Date(startDate)
      const end = new Date(endDate)
      matchesFecha = ventaDate >= start && ventaDate <= end
    }

    return matchesSearch && matchesFecha
  })

  const handleNuevaVenta = () => {
    if (newVenta) return
    setNewVenta({
      id: 0,
      fecha: "",
      producto: "",
      cantidad: 0,
      precio_unitario: 0,
      total: 0,
      cliente: "",
    })
  }

  const isOnlyLetters = (str: string) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(str)
  const startsWithUpper = (str: string) => /^[A-ZÁÉÍÓÚÑ]/.test(str)

  const handleSaveNewVenta = async () => {
    if (!newVenta) return

    const { producto, cliente, cantidad, precio_unitario, fecha } = newVenta

    if (
      !fecha.trim() ||
      !producto.trim() ||
      !cliente.trim() ||
      cantidad <= 0 ||
      precio_unitario <= 0
    ) {
      alert("Todos los campos son obligatorios y la cantidad y precio deben ser mayores a 0.")
      return
    }

    if (producto.length < 2 || cliente.length < 2) {
      alert("Producto y cliente deben tener al menos 2 caracteres.")
      return
    }

    if (!isOnlyLetters(producto) || !isOnlyLetters(cliente)) {
      alert("Producto y cliente no pueden contener números ni símbolos.")
      return
    }

    if (!startsWithUpper(producto) || !startsWithUpper(cliente)) {
      alert("Producto y cliente deben comenzar con letra mayúscula.")
      return
    }

    if (new Date(fecha) > new Date()) {
      alert("La fecha no puede ser mayor a la actual.")
      return
    }

    const total = cantidad * precio_unitario
    const ventaToAdd = { ...newVenta, total }
    const newId = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1
    ventaToAdd.id = newId
    setVentas([...ventas, ventaToAdd])
    setNewVenta(null)
  }

  const handleCancelNewVenta = () => {
    setNewVenta(null)
  }


  return (
    <div className="ventas-admin">
      <div className="ventas-header">
        <h1 className="ventas-title">Registro de Ventas</h1>
        <button className="button button-primary" onClick={handleNuevaVenta}>
          <Plus size={16} />
          <span>Nueva Venta</span>
        </button>
      </div>

      <div className="ventas-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por producto o cliente..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        <div className="ventas-loading">
          <div className="loading-spinner"></div>
          <p>Cargando ventas...</p>
        </div>
      ) : (
        <div className="ventas-table-container">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cliente</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
                  <tbody>
              {filteredVentas.length > 0 ? (
                filteredVentas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{new Date(venta.fecha).toLocaleDateString("es-ES")}</td>
                    <td>{venta.producto}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.cantidad}</td>
                    <td>{venta.precio_unitario.toFixed(2)} CUP</td>
                    <td className="venta-total">{venta.total.toFixed(2)} CUP</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="ventas-empty">
                    No se encontraron ventas
                  </td>
                </tr>
              )}

              {newVenta && (
                <tr>
                  <td>
                    <input
                      type="date"
                      style={{ width: "100%" }}
                      value={newVenta.fecha}
                      onChange={(e) =>
                        setNewVenta({ ...newVenta, fecha: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Producto"
                      value={newVenta.producto}
                      onChange={(e) =>
                        setNewVenta({ ...newVenta, producto: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Cliente"
                      value={newVenta.cliente}
                      onChange={(e) =>
                        setNewVenta({ ...newVenta, cliente: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Cantidad"
                      value={newVenta.cantidad || ""}
                      onChange={(e) =>
                        setNewVenta({ ...newVenta, cantidad: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Precio Unitario"
                      value={newVenta.precio_unitario || ""}
                      onChange={(e) =>
                        setNewVenta({ ...newVenta, precio_unitario: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    {(newVenta.cantidad * newVenta.precio_unitario).toFixed(2)} CUP
                  </td>
                  <td>
                    <div className="ventas-acciones">
                      <button className="button button-primary" onClick={handleSaveNewVenta}>
                        Aceptar
                      </button>
                      <button className="button button-icon button-danger" onClick={handleCancelNewVenta}>
                        Cancelar
                      </button>
                    </div>
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
