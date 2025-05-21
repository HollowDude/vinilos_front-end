"use client"
import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import "./abastecimiento.css"
import { BACKEND } from "@/src/types/commons"

interface ProductoTemplate {
  nombre: ProductoNombre
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
  items?: ItemForm[]
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
      nombre: ProductoNombre
      cat: string
      costo: string | number
      precio: string | number
    }
    cantidad: number
  }[]
}

type ProductoNombre =
  | "aguja_americana_14"
  | "aguja_americana_16"
  | "aguja_vastago_rl"
  | "aguja_vastago_rs"
  | "aguja_vastago_rm"
  | "labret"
  | "septum"
  | "barbell"
  | "nostril"
  | "aro"
  | "tinta_negra_oz"
  | "tinta_blanca_oz"
  | "rollo_papel_sanitario"
  | "paquete_toallitas_humedas"

const NOMBRE_LABELS: Record<ProductoNombre, string> = {
  aguja_americana_14: "Aguja Americana 14",
  aguja_americana_16: "Aguja Americana 16",
  aguja_vastago_rl: "Aguja Vástago RL",
  aguja_vastago_rs: "Aguja Vástago RS",
  aguja_vastago_rm: "Aguja Vástago RM",
  labret: "Labret",
  septum: "Septum",
  barbell: "Barbell",
  nostril: "Nostril",
  aro: "Aro",
  tinta_negra_oz: "Tinta Negra Oz",
  tinta_blanca_oz: "Tinta Blanca Oz",
  rollo_papel_sanitario: "Rollo Papel Sanitario",
  paquete_toallitas_humedas: "Paquete Toallitas Húmedas",
}

function getCategory(nombre: ProductoNombre): string {
  if (
    nombre === "aguja_americana_14" ||
    nombre === "aguja_americana_16" ||
    nombre === "aguja_vastago_rl" ||
    nombre === "aguja_vastago_rs" ||
    nombre === "aguja_vastago_rm" ||
    nombre === "tinta_negra_oz" ||
    nombre === "tinta_blanca_oz"
  ) {
    return "materiales"
  }
  if (
    nombre === "labret" ||
    nombre === "septum" ||
    nombre === "barbell" ||
    nombre === "nostril" ||
    nombre === "aro"
  ) {
    return "piercing"
  }
  // resto:
  return "cuidado"
}

export default function AbastecimientoAdmin() {
  const [reportes, setReportes] = useState<Abastecimiento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nombre, setNombre] = useState("")
  const [items, setItems] = useState<ItemForm[]>([])

  const opcionesFijas: ProductoNombre[] = Object.keys(NOMBRE_LABELS) as ProductoNombre[]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Carga de reportes existentes
        const rr = await fetch(`${BACKEND}/api/reporte_abastecimiento/`, { credentials: "include" })
        const raw = (await rr.json()) as RawAbastecimiento[]
        setReportes(raw.map(convertAbastecimiento))

        // Inicializar 4 ítems vacíos con categoría según nombre
        setItems(
          Array.from({ length: 4 }, (_, i) => {
            const nombreDefault = opcionesFijas[i % opcionesFijas.length]
            return {
              producto: {
                nombre: nombreDefault,
                cat: getCategory(nombreDefault),
                costo: 0,
                precio: 0,
              },
              cantidad: 0,
            }
          })
        )
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateItem = <K extends keyof ItemForm>(idx: number, field: K, value: ItemForm[K]) => {
    setItems(prev => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Filtrar ítems válidos
    const validItems = items
      .filter(it => it.cantidad > 0)
      .map(it => ({
        producto: {
          ...it.producto,
          cat: getCategory(it.producto.nombre),
        },
        cantidad: it.cantidad,
      }))

    if (validItems.length === 0) {
      alert("Debe completar al menos un ítem correctamente antes de registrar el pedido.")
      return
    }

    const payload = {
      nombre,
      estado: "Pedido" as const,
      items: validItems,
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
      setReportes(prev => [nuevo, ...prev])
      setNombre("")
      // Reset a 4 vacíos otra vez
      setItems(
        Array.from({ length: 4 }, (_, i) => {
          const nombreDefault = opcionesFijas[i % opcionesFijas.length]
          return {
            producto: {
              nombre: nombreDefault,
              cat: getCategory(nombreDefault),
              costo: 0,
              precio: 0,
            },
            cantidad: 0,
          }
        })
      )
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
      setReportes(prev => prev.map(rep => (rep.id === id ? updated : rep)))
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
            onChange={e => setNombre(e.target.value)}
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
                onChange={e => {
                  const nombreSel = e.target.value as ProductoNombre
                  updateItem(idx, "producto", {
                    nombre: nombreSel,
                    cat: getCategory(nombreSel),
                    costo: it.producto.costo,
                    precio: it.producto.precio,
                  })
                }}
              >
                {opcionesFijas.map(p => (
                  <option key={p} value={p}>
                    {NOMBRE_LABELS[p]}
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
                onChange={e => updateItem(idx, "cantidad", +e.target.value)}
              />
            </div>
            <div style={{ width: "6rem" }}>
              <label className="admin-form-label">Costo</label>
              <input
                type="number"
                step="0.01"
                min={0}
                className="admin-form-input"
                value={it.producto.costo}
                onChange={e =>
                  updateItem(idx, "producto", {
                    ...it.producto,
                    costo: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div style={{ width: "6rem" }}>
              <label className="admin-form-label">Precio</label>
              <input
                type="number"
                step="0.01"
                min={0}
                className="admin-form-input"
                value={it.producto.precio}
                onChange={e =>
                  updateItem(idx, "producto", {
                    ...it.producto,
                    precio: parseFloat(e.target.value),
                  })
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
          reportes.map(r => (
            <div key={r.id} className={`pedido-card estado-${r.estado.toLowerCase()}`}>
              <div className="pedido-header">
                <div className="pedido-info">
                  <div className="pedido-proveedor">{r.nombre}</div>
                  <span className={`pedido-estado estado-${r.estado.toLowerCase()}`}>{r.estado}</span>
                </div>
                <div className="pedido-fechas">
                  <div className="pedido-fecha">
                    <span>Pedido:</span> {new Date(r.fecha_pedido).toLocaleDateString()}
                  </div>
                  <div className="pedido-fecha">
                    <span>Llegada:</span> {r.fecha_llegada ? new Date(r.fecha_llegada).toLocaleDateString() : "-"}
                  </div>
                </div>
              </div>
              {r.items && r.items.length > 0 && (
                <div className="pedido-productos">
                  <h4 className="pedido-productos-titulo">Productos</h4>
                  <table className="pedido-productos-tabla">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.items.map((it, i) => (
                        <tr key={i}>
                          <td>{NOMBRE_LABELS[it.producto.nombre]}</td>
                          <td>{it.cantidad}</td>
                          <td>{it.producto.costo.toFixed(2)}</td>
                          <td>{it.producto.precio.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="pedido-total-label">
                          Total
                        </td>
                        <td className="pedido-total-value">{r.costoTot.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
              <div className="pedido-actions">
                {r.estado === "Pedido" && (
                  <button className="button button-success" onClick={() => marcarEntregado(r.id)}>
                    Marcar Entregado
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function convertAbastecimiento(raw: RawAbastecimiento): Abastecimiento {
  return {
    ...raw,
    costoTot: typeof raw.costoTot === "string" ? parseFloat(raw.costoTot) : raw.costoTot,
    items: (raw.items ?? []).map(item => ({
      producto: {
        ...item.producto,
        costo: typeof item.producto.costo === "string" ? parseFloat(item.producto.costo) : item.producto.costo,
        precio: typeof item.producto.precio === "string" ? parseFloat(item.producto.precio) : item.producto.precio,
      },
      cantidad: item.cantidad,
    })),
  }
}
