"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Check, X } from "lucide-react"
import "../tatuajes/tatuajes.css"
import "./abastecimiento.css"

interface Pedido {
  id: number
  proveedor: string
  fecha_pedido: string
  fecha_entrega: string | null
  estado: "pendiente" | "entregado" | "cancelado"
  total: number
  productos: {
    nombre: string
    cantidad: number
    precio: number
  }[]
}

export default function AbastecimientoAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("")

  // Estado para crear un nuevo pedido
  const [newPedido, setNewPedido] = useState<Pedido | null>(null)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Comentamos la API real
        /*
        const response = await fetch('/api/abastecimiento')
        const data = await response.json()
        setPedidos(data)
        */
        // Simulamos datos para el ejemplo
        setTimeout(() => {
          setPedidos([
            {
              id: 1,
              proveedor: "Suministros Pro",
              fecha_pedido: "2023-05-10",
              fecha_entrega: "2023-05-15",
              estado: "entregado",
              total: 450.75,
              productos: [
                { nombre: "Piercing de Titanio", cantidad: 20, precio: 12.5 },
                { nombre: "Expansor de Madera", cantidad: 10, precio: 8.75 },
              ],
            },
            {
              id: 2,
              proveedor: "Tintas Profesionales",
              fecha_pedido: "2023-05-20",
              fecha_entrega: null,
              estado: "pendiente",
              total: 325.5,
              productos: [
                { nombre: "Tinta Negra Premium", cantidad: 10, precio: 15.0 },
                { nombre: "Tinta Roja Premium", cantidad: 5, precio: 17.5 },
                { nombre: "Tinta Azul Premium", cantidad: 5, precio: 17.5 },
              ],
            },
            {
              id: 3,
              proveedor: "Farmacia Tattoo",
              fecha_pedido: "2023-05-05",
              fecha_entrega: "2023-05-08",
              estado: "entregado",
              total: 210.0,
              productos: [{ nombre: "Crema para Cuidado", cantidad: 40, precio: 5.25 }],
            },
            {
              id: 4,
              proveedor: "Suministros Pro",
              fecha_pedido: "2023-05-25",
              fecha_entrega: null,
              estado: "cancelado",
              total: 182.0,
              productos: [
                { nombre: "Agujas 3RL", cantidad: 20, precio: 2.1 },
                { nombre: "Agujas 5RL", cantidad: 20, precio: 2.5 },
                { nombre: "Agujas 7RL", cantidad: 20, precio: 2.75 },
                { nombre: "Agujas 9RL", cantidad: 20, precio: 2.75 },
              ],
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar pedidos:", err)
        setIsLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = pedido.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "" || pedido.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  const handleChangeStatus = (id: number, newStatus: "pendiente" | "entregado" | "cancelado") => {
    // Comentamos la API real
    /*
    await fetch(`/api/abastecimiento/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: newStatus })
    })
    */
    setPedidos(
      pedidos.map((pedido) => {
        if (pedido.id === id) {
          return {
            ...pedido,
            estado: newStatus,
            fecha_entrega: newStatus === "entregado" ? new Date().toISOString().split("T")[0] : pedido.fecha_entrega,
          }
        }
        return pedido
      })
    )
  }

  // Funciones para agregar un nuevo pedido
  const handleNuevoPedido = () => {
    if (newPedido) return
    setNewPedido({
      id: 0, // id temporal; la API asignaría el id real
      proveedor: "",
      fecha_pedido: "",
      fecha_entrega: null,
      estado: "pendiente",
      total: 0,
      productos: [],
    })
  }

  const handleSaveNewPedido = async () => {
    if (!newPedido) return
    if (!newPedido.proveedor.trim() || !newPedido.fecha_pedido.trim() || newPedido.total < 0) {
      alert("Completa correctamente el proveedor, la fecha de pedido y un total válido.")
      return
    }
    // En un caso real, se llamaría a la API para crear el nuevo pedido
    const newId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1
    const createdPedido = { ...newPedido, id: newId }
    setPedidos([...pedidos, createdPedido])
    setNewPedido(null)
  }

  const handleCancelNewPedido = () => {
    setNewPedido(null)
  }

  return (
    <div className="abastecimiento-admin">
      <div className="abastecimiento-header">
        <h1 className="abastecimiento-title">Gestión de Abastecimiento</h1>
        <button className="button button-primary" onClick={handleNuevoPedido}>
          <Plus size={16} />
          <span>Nuevo Pedido</span>
        </button>
      </div>

      <div className="abastecimiento-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por proveedor..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select className="filter-select" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="abastecimiento-loading">
          <div className="loading-spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      ) : (
        <div className="pedidos-list">
          {filteredPedidos.length > 0 ? (
            filteredPedidos.map((pedido) => (
              <div key={pedido.id} className={`pedido-card estado-${pedido.estado}`}>
                <div className="pedido-header">
                  <div className="pedido-info">
                    <h3 className="pedido-proveedor">{pedido.proveedor}</h3>
                    <span className={`pedido-estado estado-${pedido.estado}`}>
                      {pedido.estado === "pendiente"
                        ? "Pendiente"
                        : pedido.estado === "entregado"
                          ? "Entregado"
                          : "Cancelado"}
                    </span>
                  </div>
                  <div className="pedido-fechas">
                    <p className="pedido-fecha">
                      <span>Fecha de pedido:</span> {new Date(pedido.fecha_pedido).toLocaleDateString("es-ES")}
                    </p>
                    {pedido.fecha_entrega && (
                      <p className="pedido-fecha">
                        <span>Fecha de entrega:</span> {new Date(pedido.fecha_entrega).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pedido-productos">
                  <h4 className="pedido-productos-titulo">Productos</h4>
                  <table className="pedido-productos-tabla">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.productos.map((producto, index) => (
                        <tr key={index}>
                          <td>{producto.nombre}</td>
                          <td>{producto.cantidad}</td>
                          <td>{producto.precio.toFixed(2)} CUP</td>
                          <td>{(producto.cantidad * producto.precio).toFixed(2)} CUP</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="pedido-total-label">
                          Total
                        </td>
                        <td className="pedido-total-value">{pedido.total.toFixed(2)} CUP</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="pedido-actions">
                  {pedido.estado === "pendiente" && (
                    <>
                      <button
                        className="button button-icon button-success"
                        onClick={() => handleChangeStatus(pedido.id, "entregado")}
                        title="Marcar como entregado"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="button button-icon button-danger"
                        onClick={() => handleChangeStatus(pedido.id, "cancelado")}
                        title="Cancelar pedido"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="pedidos-empty">No se encontraron pedidos</div>
          )}

          {/* Tarjeta para crear un nuevo pedido */}
          {newPedido && (
            <div className="pedido-card" style={{ borderLeftColor: "#4b5563" }}>
              <div className="pedido-header">
                <div className="pedido-info">
                  <input
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Proveedor"
                    value={newPedido.proveedor}
                    onChange={(e) =>
                      setNewPedido({ ...newPedido, proveedor: e.target.value })
                    }
                  />
                </div>
                <div className="pedido-fechas">
                  <input
                    type="date"
                    style={{ width: "100%" }}
                    value={newPedido.fecha_pedido}
                    onChange={(e) =>
                      setNewPedido({ ...newPedido, fecha_pedido: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="pedido-productos">
                {/* Aquí se podrían agregar inputs para productos si se deseara */}
                <input
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="Total (CUP)"
                  value={newPedido.total || ""}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, total: Number(e.target.value) })
                  }
                />
              </div>
              <div className="pedido-actions">
                <button className="button button-primary" onClick={handleSaveNewPedido}>
                  Aceptar
                </button>
                <button className="button button-icon button-danger" onClick={handleCancelNewPedido}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
