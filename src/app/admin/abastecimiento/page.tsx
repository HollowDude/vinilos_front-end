// src/app/admin/abastecimiento/page.tsx
"use client"

import { useState, useEffect } from "react"
import { PlusCircle, RefreshCw } from "lucide-react"
import "./abastecimiento.css"
import { BACKEND } from "@/src/types/commons"

interface ProductoTemplate {
  nombre: string
  cat: string
  costo: number
  precio: number
}

interface ItemForm {
  producto: ProductoTemplate
  cantidad: number
}

interface Abastecimiento {
  id: number
  nombre: string
  estado: "Pedido" | "Entregado"
  fecha_pedido: string
  fecha_llegada: string | null
  costoTot: number
  items?: {
    producto: ProductoTemplate
    cantidad: number
  }[]
}

const NOMBRE_LABELS: Record<string, string> = {
  aguja_americana_14: "Aguja Americana 14",
  labret: "Labret",
  industrial: "Industrial",
  aguja_rl5: "Aguja RL5",
  aguja_rl7: "Aguja RL7",
  tinta_negra_oz: "Tinta Negra Oz",
  paquete_toallitas_humedas: "Paquete Toallitas Humedas",
}

export default function AbastecimientoAdmin() {
  const [templates, setTemplates] = useState<ProductoTemplate[]>([])
  const [reportes, setReportes] = useState<Abastecimiento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [nombre, setNombre] = useState("")
  const [items, setItems] = useState<ItemForm[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true)
      try {
        // Cargar plantillas
        const rp = await fetch(`${BACKEND}/api/producto/`, { credentials: "include" })
        const prodData: ProductoTemplate[] = await rp.json()
        const uniq: Record<string, ProductoTemplate> = {}
        prodData.forEach(p => {
          const costoNum = typeof p.costo === 'string' ? parseFloat(p.costo) : p.costo
          const precioNum = typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio
          if (!uniq[p.nombre]) uniq[p.nombre] = { ...p, costo: costoNum, precio: precioNum }
        })
        const list = Object.values(uniq)
        setTemplates(list)
        // inicializar ítems del formulario
        if (list.length) setItems([{ producto: list[0], cantidad: 1 }])

        // Cargar reportes
        const rr = await fetch(`${BACKEND}/api/reporte_abastecimiento/`, { credentials: "include" })
        const raw = await rr.json() as any[]
        const repData: Abastecimiento[] = raw.map(r => ({
          ...r,
          costoTot: typeof r.costoTot === 'string' ? parseFloat(r.costoTot) : r.costoTot,
          items: Array.isArray(r.items) ? r.items : []
        }))
        setReportes(repData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [])

  const addItem = () => {
    if (!templates.length) return
    setItems(prev => [...prev, { producto: templates[0], cantidad: 1 }])
  }

  const updateItem = <K extends keyof ItemForm>(idx: number, field: K, value: ItemForm[K]) => {
    setItems(prev => {
      const copy = [...prev]
      copy[idx]![field] = value
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      nombre,
      estado: 'Pedido' as const,
      items: items.map(it => ({
        producto: {
          nombre: it.producto.nombre,
          cat: it.producto.cat,
          costo: it.producto.costo,
          precio: it.producto.precio,
        },
        cantidad: it.cantidad,
      })),
    }
    const res = await fetch(`${BACKEND}/api/reporte_abastecimiento/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const r = await res.json() as any
      const nuevo: Abastecimiento = {
        ...r,
        costoTot: typeof r.costoTot === 'string' ? parseFloat(r.costoTot) : r.costoTot,
        items: r.items ?? []
      }
      setReportes(prev => [nuevo, ...prev])
      setNombre('')
      setItems([{ producto: templates[0], cantidad: 1 }])
    }
  }

  const marcarEntregado = async (id: number) => {
    const res = await fetch(`${BACKEND}/api/reporte_abastecimiento/${id}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Entregado' }),
    })
    if (res.ok) {
      const r = await res.json() as any
      const updated: Abastecimiento = {
        ...r,
        costoTot: typeof r.costoTot === 'string' ? parseFloat(r.costoTot) : r.costoTot,
        items: r.items ?? []
      }
      setReportes(prev => prev.map(rep => rep.id === id ? updated : rep))
    }
  }

  if (isLoading) {
    return <div className="abastecimiento-loading"><RefreshCw className="spin"/> Cargando...</div>
  }

  return (
    <div className="abastecimiento-admin">
      <div className="abastecimiento-header">
        <h2 className="abastecimiento-title">Abastecimientos</h2>
      </div>

      {/* Formulario */}
      <form className="abastecimiento-filters" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label className="admin-form-label">Nombre del Pedido</label>
          <input
            className="admin-form-input"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre del pedido"
            required
          />
        </div>

        {items.map((it, idx) => (
          <div key={idx} className="admin-form-group flex gap-2">
            {/* Producto */}
            <div className="flex-1">
              <label className="admin-form-label">Producto</label>
              <select
                className="admin-form-select"
                value={it.producto.nombre}
                onChange={e => {
                  const sel = templates.find(t => t.nombre === e.target.value)!
                  updateItem(idx, 'producto', sel)
                }}
              >
                {templates.map(t => (
                  <option key={t.nombre} value={t.nombre}>
                    {NOMBRE_LABELS[t.nombre]}
                  </option>
                ))}
              </select>
            </div>
            {/* Cantidad, costo, precio */}
            <div style={{ width: '4rem' }}>
              <label className="admin-form-label">Cant.</label>
              <input type="number" min={1} className="admin-form-input"
                value={it.cantidad}
                onChange={e => updateItem(idx, 'cantidad', +e.target.value)}
              />
            </div>
            <div style={{ width: '6rem' }}>
              <label className="admin-form-label">Costo</label>
              <input type="number" step="0.01" className="admin-form-input"
                value={it.producto.costo}
                onChange={e => updateItem(idx, 'producto', { ...it.producto, costo: parseFloat(e.target.value) })}
              />
            </div>
            <div style={{ width: '6rem' }}>
              <label className="admin-form-label">Precio</label>
              <input type="number" step="0.01" className="admin-form-input"
                value={it.producto.precio}
                onChange={e => updateItem(idx, 'producto', { ...it.producto, precio: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        ))}

        <button type="button" className="button-outline" onClick={addItem}>
          <PlusCircle /> Añadir ítem
        </button>
        <button type="submit" className="button-primary">
          Crear pedido
        </button>
      </form>

      {/* Lista de pedidos */}
      <div className="pedidos-list">
        {reportes.length === 0 ? (
          <div className="pedidos-empty">No hay pedidos</div>
        ) : reportes.map(r => (
          <div key={r.id} className={`pedido-card estado-${r.estado.toLowerCase()}`}> 
            <div className="pedido-header">
              <div className="pedido-info">
                <div className="pedido-proveedor">{r.nombre}</div>
                <span className={`pedido-estado estado-${r.estado.toLowerCase()}`}>{r.estado}</span>
              </div>
              <div className="pedido-fechas">
                <div className="pedido-fecha"><span>Pedido:</span> {new Date(r.fecha_pedido).toLocaleDateString()}</div>
                <div className="pedido-fecha"><span>Llegada:</span> {r.fecha_llegada ? new Date(r.fecha_llegada).toLocaleDateString() : '-'}</div>
              </div>
            </div>
            {r.items && r.items.length > 0 && (
              <div className="pedido-productos">
                <h4 className="pedido-productos-titulo">Productos</h4>
                <table className="pedido-productos-tabla">
                  <thead><tr><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Precio</th></tr></thead>
                  <tbody>
                    {r.items.map((it, i) => (
                      <tr key={i}>
                        <td>{NOMBRE_LABELS[it.producto.nombre]}</td>
                        <td>{it.cantidad}</td>
                        <td>{Number(it.producto.costo).toFixed(2)}</td>
                        <td>{Number(it.producto.precio).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={3} className="pedido-total-label">Total</td><td className="pedido-total-value">{r.costoTot.toFixed(2)}</td></tr>
                  </tfoot>
                </table>
              </div>
            )}
            <div className="pedido-actions">
              {r.estado === 'Pedido' && (
                <button className="button button-success" onClick={() => marcarEntregado(r.id)}>
                  Marcar Entregado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}