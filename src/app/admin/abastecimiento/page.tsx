"use client"
import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
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

interface RawAbastecimiento {
  id: number
  nombre: string
  estado: "Pedido" | "Entregado"
  fecha_pedido: string
  fecha_llegada: string | null
  costoTot: string | number
  items?: {
    producto: {
      nombre: string
      cat: string
      costo: string | number
      precio: string | number
    }
    cantidad: number
  }[]
}

const convertAbastecimiento = (raw: RawAbastecimiento): Abastecimiento => ({
  ...raw,
  costoTot: typeof raw.costoTot === "string" ? parseFloat(raw.costoTot) : raw.costoTot,
  items: (raw.items ?? []).map((item) => ({
    producto: {
      ...item.producto,
      costo: typeof item.producto.costo === "string" ? parseFloat(item.producto.costo) : item.producto.costo,
      precio: typeof item.producto.precio === "string" ? parseFloat(item.producto.precio) : item.producto.precio,
    },
    cantidad: item.cantidad,
  })),
})

const NOMBRE_LABELS: Record<string, string> = {
  aguja_americana_15: "Aguja Americana 15",
  aguja_americana_14: "Aguja Americana 14",
  aguja_americana_16: "Aguja Americana 16",
  aguja_vastago_rl: "Aguja Vastago RL",
  aguja_vastago_rs: "Aguja Vastago RS",
  aguja_vastago_rm: "Aguja Vastago RM",
  labret: "Labret",
  septum: "Septum",
  barbell: "Barbell",
  nostril: "Nostril",
  aro: "Aro",
  tinta_negra_oz: "Tinta Negra Oz",
  tinta_blanca_oz: "Tinta Blanca Oz",
  rollo_papel_sanitario: "Rollo Papel Sanitario",
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
        const rp = await fetch(`${BACKEND}/api/producto/`, { credentials: "include" })
        const prodData: ProductoTemplate[] = await rp.json()
        const uniq: Record<string, ProductoTemplate> = {}
        prodData.forEach((p) => {
          const costoNum = typeof p.costo === "string" ? parseFloat(p.costo) : p.costo
          const precioNum = typeof p.precio === "string" ? parseFloat(p.precio) : p.precio
          if (!uniq[p.nombre]) uniq[p.nombre] = { ...p, costo: costoNum, precio: precioNum }
        })
        const list = Object.values(uniq)
        setTemplates(list)

        // Inicializar siempre 4 formularios vacíos
        setItems(Array.from({ length: 4 }, () => ({ producto: list[0], cantidad: 0 })))

        const rr = await fetch(`${BACKEND}/api/reporte_abastecimiento/`, { credentials: "include" })
        const raw = (await rr.json()) as RawAbastecimiento[]
        setReportes(raw.map(convertAbastecimiento))
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [])

  const updateItem = <K extends keyof ItemForm>(idx: number, field: K, value: ItemForm[K]) => {
    setItems((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items.filter((it) => it.cantidad > 0)

    if (validItems.length === 0) {
      alert("Debes completar al menos un ítem antes de crear el pedido.")
      return
    }

    const payload = {
      nombre,
      estado: "Pedido" as const,
      items: validItems.map((it) => ({
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
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const r = (await res.json()) as RawAbastecimiento
      const nuevo = convertAbastecimiento(r)
      setReportes((prev) => [nuevo, ...prev])
      setNombre("")
      setItems(Array.from({ length: 4 }, () => ({ producto: templates[0], cantidad: 0 })))
    }
  }

  const marcarEntregado = async (id: number) => {
    const res = await fetch(`${BACKEND}/api/reporte_abastecimiento/${id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Entregado" }),
    })
    if (res.ok) {
      const r = (await res.json()) as RawAbastecimiento
      const updated = convertAbastecimiento(r)
      setReportes((prev) => prev.map((rep) => (rep.id === id ? updated : rep)))
    }
  }

  if (isLoading) {
    return (
      <div className="abastecimiento-loading">
        <RefreshCw className="spin" /> Cargando...
      </div>
    )
  }

  return (
    <div className="abastecimiento-admin">
      <div className="abastecimiento-header">
        <h2 className="abastecimiento-title">Abastecimientos</h2>
      </div>

      <form className="abastecimiento-filters" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label className="admin-form-label">Nombre del Pedido</label>
          <input
            className="admin-form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del pedido"
            required
          />
        </div>

        {items.map((it, idx) => (
          <div key={idx} className="admin-form-group flex gap-2">
            <div className="flex-1">
              <label className="admin-form-label">Producto</label>
              <select
                className="admin-form-select"
                value={it.producto.nombre}
                onChange={(e) => {
                  const sel = templates.find((t) => t.nombre === e.target.value)
                  if (sel) updateItem(idx, "producto", sel)
                }}
              >
                {templates.map((t) => (
                  <option key={t.nombre} value={t.nombre}>
                    {NOMBRE_LABELS[t.nombre]}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: "4rem" }}>
              <label className="admin-form-label">Cant.</label>
              <input
                type="number"
                min={0}
                className="admin-form-input"
                value={it.cantidad}
                onChange={(e) => updateItem(idx, "cantidad", +e.target.value)}
              />
            </div>
            <div style={{ width: "6rem" }}>
              <label className="admin-form-label">Costo</label>
              <input
                type="number"
                step="0.01"
                className="admin-form-input"
                value={it.producto.costo}
                onChange={(e) =>
                  updateItem(idx, "producto", { ...it.producto, costo: parseFloat(e.target.value) })
                }
              />
            </div>
            <div style={{ width: "6rem" }}>
              <label className="admin-form-label">Precio</label>
              <input
                type="number"
                step="0.01"
                className="admin-form-input"
                value={it.producto.precio}
                onChange={(e) =>
                  updateItem(idx, "producto", { ...it.producto, precio: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
        ))}

        <button type="submit" className="button-primary">
          Crear pedido
        </button>
      </form>

      <div className="pedidos-list">
        {reportes.length === 0 ? (
          <div className="pedidos-empty">No hay pedidos</div>
        ) : (
          reportes.map((r) => (
            <div key={r.id} className={`pedido-card estado-${r.estado.toLowerCase()}`}>
              <div className="pedido-header">
                <strong>{r.nombre}</strong> - <span>{r.estado}</span>
                {r.estado === "Pedido" && (
                  <button className="button-mini" onClick={() => marcarEntregado(r.id)}>
                    Marcar como entregado
                  </button>
                )}
              </div>
              <div className="pedido-fechas">
                Pedido: {r.fecha_pedido}{" "}
                {r.fecha_llegada ? `| Llegada: ${r.fecha_llegada}` : ""}
              </div>
              <div className="pedido-items">
                {r.items?.map((item, i) => (
                  <div key={i} className="pedido-item">
                    {NOMBRE_LABELS[item.producto.nombre] ?? item.producto.nombre} × {item.cantidad}
                  </div>
                ))}
              </div>
              <div className="pedido-total">Costo total: ${r.costoTot.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
