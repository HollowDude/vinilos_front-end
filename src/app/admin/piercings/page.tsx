"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "../tatuajes/tatuajes.css"

const UBICACIONES_API = [
  'Lóbulo','Helix','Tragus','Antitragus','Daith','Snug',
  'Fosa Nasal','Ceja','Ombligo','Pezon','Microdermal'
] as const

type Ubi = typeof UBICACIONES_API[number] | ""

// Tipamos un formulario que puede tener ubi = "" mientras editamos/creamos
interface Piercing {
  id: number
  nombre: string
  ubi: typeof UBICACIONES_API[number]
  foto: string | null
  public: boolean
  precio: number
}

type PiercingForm = Omit<Piercing, "ubi"> & { ubi: Ubi }

export default function PiercingsAdmin() {
  const [piercings, setPiercings] = useState<Piercing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterUbi, setFilterUbi] = useState<Ubi>("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<(Partial<PiercingForm> & { id: number; fotoFile?: File }) | null>(null)

  const [newPiercing, setNewPiercing] = useState<(Partial<PiercingForm> & { fotoFile?: File }) | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      await refreshCSRF()
      setIsLoading(true)
      const res = await fetch(`${BACKEND}/api/piercing/`, { credentials: 'include' })
      const data: Piercing[] = await res.json()
      setPiercings(data)
      setIsLoading(false)
    }
    fetchAll()
  }, [BACKEND])

  const filtered = piercings.filter(p => {
    const term = searchTerm.toLowerCase()
    return (
      (p.nombre.toLowerCase().includes(term) || p.ubi.toLowerCase().includes(term)) &&
      (filterUbi === "" || p.ubi === filterUbi)
    )
  })
  const ubicaciones = Array.from(new Set(piercings.map(p => p.ubi)))

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro eliminar?')) return
    await refreshCSRF()
    await fetch(`${BACKEND}/api/piercing/${id}/`, {
      method: 'DELETE',
      credentials: 'include'
    })
    setPiercings(prev => prev.filter(x => x.id !== id))
  }

  const startEdit = (p: Piercing) => {
    setEditingId(p.id)
    setEditedData({ ...p })
  }
  const cancelEdit = () => {
    setEditingId(null)
    setEditedData(null)
  }

  const saveEdit = async () => {
    if (!editedData) return
    const form = new FormData()
    ;(["nombre","ubi","public","precio"] as Array<keyof PiercingForm>).forEach(k => {
      const val = editedData[k] ?? ""
      form.append(k, String(val))
    })
    if (editedData.fotoFile) form.append("foto", editedData.fotoFile)

    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/piercing/${editedData.id}/`, {
      method: 'PATCH',
      credentials: 'include',
      body: form
    })
    const updated: Piercing = await res.json()
    setPiercings(prev => prev.map(x => x.id === updated.id ? updated : x))
    cancelEdit()
  }

  const startNew = () => {
    if (newPiercing) return
    setNewPiercing({ nombre: "", ubi: "", public: false, precio: 250 })
  }
  const cancelNew = () => setNewPiercing(null)

  const saveNew = async () => {
    if (!newPiercing) return
    const form = new FormData()
    ;(["nombre","ubi","public","precio"] as Array<keyof PiercingForm>).forEach(k => {
      const val = newPiercing[k] ?? ""
      form.append(k, String(val))
    })
    if (newPiercing.fotoFile) form.append("foto", newPiercing.fotoFile)

    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/piercing/`, {
      method: 'POST',
      credentials: 'include',
      body: form
    })
    const created: Piercing = await res.json()
    setPiercings(prev => [...prev, created])
    cancelNew()
  }

  return (
    <div className="tatuajes-admin">
      <div className="tatuajes-header">
        <h1 className="tatuajes-title">Administrar Piercings</h1>
        <button className="button button-primary" onClick={startNew}>
          <Plus size={16}/> <span>Nuevo</span>
        </button>
      </div>

      <div className="tatuajes-filters">
        <div className="search-container">
          <Search size={18} className="search-icon"/>
          <input
            className="search-input"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <Filter size={18} className="filter-icon"/>
          <select
            className="filter-select"
            value={filterUbi}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterUbi(e.target.value as Ubi)}
          >
            <option value="">Todas ubicaciones</option>
            {ubicaciones.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {isLoading
        ? (
          <div className="tatuajes-loading">
            <div className="loading-spinner"/> <p>Cargando...</p>
          </div>
        )
        : (
          <div className="tatuajes-table-container">
            <table className="tatuajes-table">
              <thead>
                <tr>
                  <th>Foto</th><th>Nombre</th><th>Ubicación</th><th>Precio</th><th>Público</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  editingId === p.id
                    ? (
                      <tr key={p.id}>
                        <td>
                          <div className="tatuaje-imagen-container">
                            <Image
                              src={editedData?.fotoFile
                                ? URL.createObjectURL(editedData.fotoFile)
                                : p.foto ?? "/placeholder.svg"
                              }
                              alt={`Foto de ${p.nombre}`}
                              width={80}
                              height={80}
                              className="tatuaje-imagen"
                            />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (file) setEditedData(d => d ? { ...d, fotoFile: file } : d)
                            }}
                          />
                        </td>
                        <td>
                          <input
                            value={editedData?.nombre ?? ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditedData(d => d ? { ...d, nombre: e.target.value } : d)
                            }
                            style={{ width: "100%" }}
                          />
                        </td>
                        <td>
                          <select
                            value={editedData?.ubi ?? ""}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                              setEditedData(d => d ? { ...d, ubi: e.target.value as Ubi } : d)
                            }
                            style={{ width: "100%" }}
                          >
                            <option value="">Seleccionar...</option>
                            {UBICACIONES_API.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editedData?.precio ?? 0}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditedData(d => d ? { ...d, precio: parseInt(e.target.value) } : d)
                            }
                            style={{ width: "100%" }}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={editedData?.public ?? false}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditedData(d => d ? { ...d, public: e.target.checked } : d)
                            }
                          />
                        </td>
                        <td>
                          <button className="button button-primary" onClick={saveEdit}>OK</button>
                          <button className="button button-ghost" onClick={cancelEdit}>X</button>
                        </td>
                      </tr>
                    )
                    : (
                      <tr key={p.id}>
                        <td>
                          <div className="tatuaje-imagen-container">
                            <Image
                              src={p.foto ?? "/placeholder.svg"}
                              alt={`Foto de ${p.nombre}`}
                              width={80}
                              height={80}
                              className="tatuaje-imagen"
                            />
                          </div>
                        </td>
                        <td>{p.nombre}</td>
                        <td>{p.ubi}</td>
                        <td>{p.precio}</td>
                        <td>{p.public ? "Sí" : "No"}</td>
                        <td className="tatuaje-acciones">
                          <button onClick={() => startEdit(p)}><Edit size={16}/></button>
                          <button className="button-danger" onClick={() => handleDelete(p.id)}><Trash size={16}/></button>
                        </td>
                      </tr>
                    )
                ))}

                {newPiercing && (
                  <tr>
                    <td>
                      <div className="tatuaje-imagen-container">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0]
                            if (file) setNewPiercing(n => ({ ...n!, fotoFile: file }))
                          }}
                        />
                        {newPiercing.fotoFile
                          ? (
                            <Image
                              src={URL.createObjectURL(newPiercing.fotoFile)}
                              alt="Nueva foto"
                              width={80}
                              height={80}
                              className="tatuaje-imagen"
                            />
                          )
                          : (
                            <Image
                              src="/placeholder.svg"
                              alt="Placeholder"
                              width={80}
                              height={80}
                              className="tatuaje-imagen"
                            />
                          )
                        }
                      </div>
                    </td>
                    <td>
                      <input
                        placeholder="Nombre"
                        value={newPiercing.nombre ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewPiercing(n => ({ ...n!, nombre: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={newPiercing.ubi ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setNewPiercing(n => ({ ...n!, ubi: e.target.value as Ubi }))
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {UBICACIONES_API.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Precio"
                        value={newPiercing.precio ?? 250}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewPiercing(n => ({ ...n!, precio: parseInt(e.target.value) }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={newPiercing.public ?? false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewPiercing(n => ({ ...n!, public: e.target.checked }))
                        }
                      />
                    </td>
                    <td>
                      <button className="button button-primary" onClick={saveNew}>OK</button>
                      <button className="button button-ghost" onClick={cancelNew}>X</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
