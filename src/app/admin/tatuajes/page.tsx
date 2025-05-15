// src/app/admin/tatuajes/page.tsx
"use client"

import { useState, useEffect, ChangeEvent } from "react"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "../tatuajes/tatuajes.css"

const ARTISTAS_API = [
  'Xavier Verdecie Ramos',
  'Osmel Medero Rosales'
] as const

const ESTILOS_API = [
  'Realismo', 'Tradicional', 'Neotradicional',
  'Acuarela', 'Geométrico', 'BlackWork', 'Trival', 'Sigilo'
] as const

type Artista = typeof ARTISTAS_API[number]
type Estilo = typeof ESTILOS_API[number]
type EstiloForm = Estilo | ""

// Durante edición/creación, `estilo` puede ser vacío
interface Tattoo {
  id: number
  nombre: string
  estilo: Estilo
  precio: number
  artista: Artista
  foto: string | null
  public: boolean
}
type TattooForm = Omit<Tattoo, "estilo"> & { estilo: EstiloForm }

export default function TatuajesAdmin() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstilo, setFilterEstilo] = useState<EstiloForm>("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<(Partial<TattooForm> & { id: number; fotoFile?: File }) | null>(null)

  const [newTattoo, setNewTattoo] = useState<(Partial<TattooForm> & { fotoFile?: File }) | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      await refreshCSRF()
      setIsLoading(true)
      const res = await fetch(`${BACKEND}/api/tattoo/`, { credentials: 'include' })
      const data: Tattoo[] = await res.json()
      setTattoos(data)
      setIsLoading(false)
    }
    fetchAll()
  }, [BACKEND])

  const filtered = tattoos.filter(t => {
    const term = searchTerm.toLowerCase()
    return (
      (t.nombre.toLowerCase().includes(term) || t.artista.toLowerCase().includes(term)) &&
      (filterEstilo === "" || t.estilo === filterEstilo)
    )
  })

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro eliminar?')) return
    await refreshCSRF()
    await fetch(`${BACKEND}/api/tattoo/${id}/`, { method: 'DELETE', credentials: 'include' })
    setTattoos(prev => prev.filter(x => x.id !== id))
  }

  const startEdit = (t: Tattoo) => {
    setEditingId(t.id)
    setEditedData({ ...t })
  }
  const cancelEdit = () => {
    setEditingId(null)
    setEditedData(null)
  }

  const saveEdit = async () => {
    if (!editedData) return
    const form = new FormData()
    ;(["nombre","estilo","artista","public","precio"] as Array<keyof TattooForm>).forEach(k => {
      const val = editedData[k] ?? ""
      form.append(k, String(val))
    })
    if (editedData.fotoFile) form.append("foto", editedData.fotoFile)

    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/tattoo/${editedData.id}/`, {
      method: 'PATCH',
      credentials: 'include',
      body: form
    })
    if (res.ok) {
      const updated: Tattoo = await res.json()
      setTattoos(prev => prev.map(x => x.id === updated.id ? updated : x))
      cancelEdit()
    } else {
      const err = await res.json()
      alert(err.message || 'Error actualizando tattoo')
    }
  }

  const startNew = () => {
    if (newTattoo) return
    setNewTattoo({
      nombre: '',
      estilo: ESTILOS_API[0],
      artista: ARTISTAS_API[0],
      public: false,
      precio: 0
    })
  }
  const cancelNew = () => setNewTattoo(null)

  const saveNew = async () => {
    if (!newTattoo) return
    const form = new FormData()
    ;(["nombre","estilo","artista","public","precio"] as Array<keyof TattooForm>).forEach(k => {
      const val = newTattoo[k] ?? ""
      form.append(k, String(val))
    })
    if (newTattoo.fotoFile) form.append("foto", newTattoo.fotoFile)

    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/tattoo/`, {
      method: 'POST',
      credentials: 'include',
      body: form
    })
    if (res.ok) {
      const created: Tattoo = await res.json()
      setTattoos(prev => [...prev, created])
      cancelNew()
    } else {
      const err = await res.json()
      alert(err.message || 'Error creando tattoo')
    }
  }

  return (
    <div className="tatuajes-admin">
      <div className="tatuajes-header">
        <h1 className="tatuajes-title">Administrar Tattoos</h1>
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
            value={filterEstilo}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFilterEstilo(e.target.value as EstiloForm)
            }
          >
            <option value="">Todos los estilos</option>
            {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
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
                  <th>Foto</th><th>Nombre</th><th>Estilo</th><th>Artista</th><th>Precio</th><th>Público</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  editingId === t.id
                    ? (
                      <tr key={t.id}>
                        <td>
                          <div className="tatuaje-imagen-container">
                            <Image
                              src={editedData?.fotoFile
                                ? URL.createObjectURL(editedData.fotoFile)
                                : t.foto ?? "/placeholder.svg"
                              }
                              alt={`Foto de ${t.nombre}`}
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
                            value={editedData?.estilo ?? ""}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                              setEditedData(d => d ? { ...d, estilo: e.target.value as EstiloForm } : d)
                            }
                            style={{ width: "100%" }}
                          >
                            <option value="">Seleccionar...</option>
                            {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                        </td>
                        <td>
                          <select
                            value={editedData?.artista ?? ""}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                              setEditedData(d => d ? { ...d, artista: e.target.value as Artista } : d)
                            }
                            style={{ width: "100%" }}
                          >
                            {ARTISTAS_API.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editedData?.precio ?? 0}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditedData(d => d ? { ...d, precio: Number(e.target.value) } : d)
                            }
                            style={{ width: "100%" }}
                            min={0.01}
                            step={0.01}
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
                          <button className="button button-primary" onClick={saveEdit}>Guardar</button>
                          <button className="button button-ghost" onClick={cancelEdit}>Cancelar</button>
                        </td>
                      </tr>
                    )
                    : (
                      <tr key={t.id}>
                        <td>
                          <div className="tatuaje-imagen-container">
                            <Image
                              src={t.foto ?? "/placeholder.svg"}
                              alt={`Foto de ${t.nombre}`}
                              width={80}
                              height={80}
                              className="tatuaje-imagen"
                            />
                          </div>
                        </td>
                        <td>{t.nombre}</td>
                        <td>{t.estilo}</td>
                        <td>{t.artista}</td>
                        <td>${t.precio.toFixed(2)}</td>
                        <td>{t.public ? "Sí" : "No"}</td>
                        <td className="tatuaje-acciones">
                          <button onClick={() => startEdit(t)}><Edit size={16}/></button>
                          <button className="button-danger" onClick={() => handleDelete(t.id)}><Trash size={16}/></button>
                        </td>
                      </tr>
                    )
                ))}

                {newTattoo && (
                  <tr>
                    <td>
                      <div className="tatuaje-imagen-container">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0]
                            if (file) setNewTattoo(n => ({ ...n!, fotoFile: file }))
                          }}
                        />
                        {newTattoo.fotoFile
                          ? (
                            <Image
                              src={URL.createObjectURL(newTattoo.fotoFile)}
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
                        value={newTattoo.nombre ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewTattoo(n => ({ ...n!, nombre: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={newTattoo.estilo ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setNewTattoo(n => ({ ...n!, estilo: e.target.value as EstiloForm }))
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={newTattoo.artista ?? ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setNewTattoo(n => ({ ...n!, artista: e.target.value as Artista }))
                        }
                      >
                        {ARTISTAS_API.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newTattoo.precio ?? 0}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewTattoo(n => ({ ...n!, precio: Number(e.target.value) }))
                        }
                        min={0.01}
                        step={0.01}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={newTattoo.public ?? false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewTattoo(n => ({ ...n!, public: e.target.checked }))
                        }
                      />
                    </td>
                    <td>
                      <button className="button button-primary" onClick={saveNew}>Guardar</button>
                      <button className="button button-ghost" onClick={cancelNew}>Cancelar</button>
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
