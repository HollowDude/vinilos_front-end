"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Plus } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "./ventas.css"

interface ReporteVenta {
  id: number
  fecha: string
  productos: number[]
  cliente: string
  cantidad: number
  aporte: number
}
interface Producto {
  id: number
  nombre: string
  cat: string
  disponible: boolean
}

export default function VentasAdmin() {
  const [reportes, setReportes] = useState<ReporteVenta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [nameMap, setNameMap] = useState<Record<number,string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [newCantidad, setNewCantidad] = useState(1)
  const [newCliente, setNewCliente] = useState("")
  const [newProductoId, setNewProductoId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      await refreshCSRF()
      setIsLoading(true)
      // fetch ventas
      const repRes = await fetch(`${BACKEND}/api/reporte_venta/`, { credentials: 'include' })
      const repData: ReporteVenta[] = await repRes.json()
      setReportes(repData)
      
      // fetch piercings for new venta
      const prodRes = await fetch(`${BACKEND}/api/producto/piercings_venta/`, { credentials: 'include' })
      const prodData: Producto[] = await prodRes.json()
      setProductos(prodData)

      // fetch name for first producto in each reporte
      const firstIds = Array.from(new Set(repData.map(r => r.productos[0]))).filter(Boolean)
      const map: Record<number,string> = {}
      await Promise.all(firstIds.map(async id => {
        const r = await fetch(`${BACKEND}/api/producto/${id}/`, { credentials: 'include' })
        if (r.ok) {
          const p: Producto = await r.json()
          map[id] = p.nombre
        }
      }))
      setNameMap(map)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const filtered = reportes.filter(r => {
    const term = searchTerm.toLowerCase()
    const matchSearch = (nameMap[r.productos[0]]||"").toLowerCase().includes(term)
      || r.cliente.toLowerCase().includes(term)
    let matchFecha = true
    if (startDate && endDate) {
      const f = new Date(r.fecha)
      matchFecha = f >= new Date(startDate) && f <= new Date(endDate)
    }
    return matchSearch && matchFecha
  })

  const handleNueva = () => {
    if (newProductoId !== null) return
    setNewProductoId(productos[0]?.id ?? null)
  }

  const handleSaveNew = async () => {
    if (newProductoId === null || newCantidad <= 0 || !newCliente.trim()) {
      alert('Complete cliente, producto y cantidad>0')
      return
    }
    const prod = productos.find(p=>p.id===newProductoId)
    if (!prod) return alert('Producto inválido')
    const payload = { producto_nombre: prod.nombre, cantidad: newCantidad, cliente: newCliente }
    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/reporte_venta/`, {
      method:'POST', credentials:'include', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const created: ReporteVenta = await res.json()
      // fetch name for its first producto
      const pid = created.productos[0]
      const r = await fetch(`${BACKEND}/api/producto/${pid}/`, { credentials:'include' })
      if (r.ok) {
        const p: Producto = await r.json()
        setNameMap(m=>({...m,[pid]:p.nombre}))
      }
      setReportes([created, ...reportes])
      setNewProductoId(null)
      setNewCliente("")
      setNewCantidad(1)
    } else {
      const err = await res.json()
      alert(err.error || 'Error al crear venta')
    }
  }

  return (
    <div className="ventas-admin">
      <div className="ventas-header">
        <h1 className="ventas-title">Registro de Ventas</h1>
        <button className="button button-primary" onClick={handleNueva}>
          <Plus size={16}/> <span>Nueva Venta</span>
        </button>
      </div>
      <div className="ventas-filters">
        <div className="search-container">
          <Search size={18} className="search-icon"/>
          <input className="search-input" placeholder="Buscar..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
        </div>
        <div className="date-filter">
          <div className="date-input-container"><Calendar size={18} className="date-icon"/><input type="date" className="date-input" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div>
          <span className="date-separator">a</span>
          <div className="date-input-container"><Calendar size={18} className="date-icon"/><input type="date" className="date-input" value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
        </div>
      </div>
      {isLoading ? <div className="ventas-loading"><div className="loading-spinner"/> <p>Cargando ventas...</p></div> : (
        <div className="ventas-table-container">
          <table className="ventas-table">
            <thead><tr><th>Fecha</th><th>Producto</th><th>Cliente</th><th>Cantidad</th><th>Aporte</th></tr></thead>
            <tbody>
              {filtered.map(r=>(
                <tr key={r.id}>
                  <td>{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                  <td>{nameMap[r.productos[0]]||r.productos[0]}</td>
                  <td>{r.cliente}</td>
                  <td>{r.cantidad}</td>
                  <td className="venta-total">{r.aporte} CUP</td>
                </tr>
              ))}
              {newProductoId!==null && (
                <tr>
                  <td>{new Date().toLocaleDateString('en-CA')}</td>
                  <td><select className="admin-form-select" value={newProductoId} onChange={e=>setNewProductoId(+e.target.value)}>
                    {productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select></td>
                  <td><input className="admin-form-input" placeholder="Cliente" value={newCliente} onChange={e=>setNewCliente(e.target.value)}/></td>
                  <td><input type="number" min={1} className="admin-form-input" value={newCantidad} onChange={e=>setNewCantidad(+e.target.value)}/></td>
                  <td className="ventas-acciones"><button className="button button-primary" onClick={handleSaveNew}>Aceptar</button><button className="button button-icon button-danger" onClick={()=>setNewProductoId(null)}>Cancelar</button></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}