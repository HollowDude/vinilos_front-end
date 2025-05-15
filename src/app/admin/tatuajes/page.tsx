"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import { BACKEND } from "@/src/types/commons"
import { refreshCSRF } from "@/src/hooks/use_auth"
import "../tatuajes/tatuajes.css"

const ARTISTAS_API = [
  'Xavier Verdecie Ramos',
  'Osmel Medero Rosales'
]

const ESTILOS_API = [
  'Realismo', 'Tradicional', 'Neotradicional', 
  'Acuarela', 'Geométrico', 'BlackWork', 'Trival', 'Sigilo'
]

interface Tattoo {
  id: number
  nombre: string
  estilo: string
  precio: number
  artista: string
  foto: string | null
  public: boolean
}

export default function TatuajesAdmin() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstilo, setFilterEstilo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Partial<Tattoo> & { id: number } | null>(null)
  const [newTattoo, setNewTattoo] = useState<Partial<Tattoo> & { fotoFile?: File } | null>(null)

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
  }, [])

  const filtered = tattoos.filter(t => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      t.nombre.toLowerCase().includes(term) ||
      t.artista.toLowerCase().includes(term)
    const matchesFilter = filterEstilo === "" || t.estilo === filterEstilo
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro eliminar?')) return
    await refreshCSRF()
    await fetch(`${BACKEND}/api/tattoo/${id}/`, { method: 'DELETE', credentials: 'include' })
    setTattoos(t => t.filter(x => x.id !== id))
  }

  const startEdit = (t: Tattoo) => {
    setEditingId(t.id)
    setEditedData({ ...t })
  }

  const cancelEdit = () => { setEditingId(null); setEditedData(null) }

  const saveEdit = async () => {
    if (!editedData) return
    const form = new FormData()
    ;(['nombre','estilo','artista','public','precio'] as const).forEach(k => 
      form.append(k, String((editedData as any)[k] || '')
    ))
    
    if ((editedData as any).fotoFile) form.append('foto', (editedData as any).fotoFile)
    
    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/tattoo/${editedData.id}/`, { 
      method: 'PATCH', 
      credentials: 'include', 
      body: form 
    })
    
    if (res.ok) {
      const updated: Tattoo = await res.json()
      setTattoos(t => t.map(x => x.id === updated.id ? updated : x))
      cancelEdit()
    } else {
      const error = await res.json()
      alert(error.message || 'Error actualizando tattoo')
    }
  }

  const startNew = () => {
    if (newTattoo) return
    setNewTattoo({ 
      nombre: '', 
      estilo: '', 
      artista: ARTISTAS_API[0], 
      public: false, 
      precio: 0 
    })
  }

  const cancelNew = () => setNewTattoo(null)

  const saveNew = async () => {
    if (!newTattoo) return
    const form = new FormData()
    ;(['nombre','estilo','artista','public','precio'] as const).forEach(k => 
      form.append(k, String((newTattoo as any)[k] || '')
    ))
    
    if ((newTattoo as any).fotoFile) form.append('foto', (newTattoo as any).fotoFile)
    
    await refreshCSRF()
    const res = await fetch(`${BACKEND}/api/tattoo/`, { 
      method: 'POST', 
      credentials: 'include', 
      body: form 
    })
    
    if (res.ok) {
      const created: Tattoo = await res.json()
      setTattoos(t => [...t, created])
      cancelNew()
    } else {
      const error = await res.json()
      alert(error.message || 'Error creando tattoo')
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
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <Filter size={18} className="filter-icon"/>
          <select
            className="filter-select"
            value={filterEstilo}
            onChange={e => setFilterEstilo(e.target.value)}
          >
            <option value="">Todos los estilos</option>
            {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="tatuajes-loading"><div className="loading-spinner"/> <p>Cargando...</p></div>
      ) : (
        <div className="tatuajes-table-container">
          <table className="tatuajes-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Estilo</th>
                <th>Artista</th>
                <th>Precio</th>
                <th>Público</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                editingId === t.id ? (
                  <tr key={t.id}>
                    <td>
                      <div className="tatuaje-imagen-container">
                        <img
                          src={(editedData as any).fotoFile
                            ? URL.createObjectURL((editedData as any).fotoFile)
                            : t.foto || '/placeholder.svg'}
                          className="tatuaje-imagen"
                        />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files?.[0]) setEditedData(d => d ? {...d, fotoFile: e.target.files![0]} : d)
                        }}
                      />
                    </td>
                    <td>
                      <input 
                        value={(editedData as any).nombre || ''} 
                        onChange={e => setEditedData(d => d ? {...d, nombre: e.target.value} : d)} 
                        style={{width: '100%'}}
                      />
                    </td>
                    <td>
                      <select
                        value={(editedData as any).estilo || ''}
                        onChange={e => setEditedData(d => d ? {...d, estilo: e.target.value} : d)}
                        style={{width: '100%'}}
                      >
                        <option value="">Seleccionar...</option>
                        {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={(editedData as any).artista || ''}
                        onChange={e => setEditedData(d => d ? {...d, artista: e.target.value} : d)}
                        style={{width: '100%'}}
                      >
                        {ARTISTAS_API.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={(editedData as any).precio || 0}
                        onChange={e => setEditedData(d => d ? {...d, precio: Number(e.target.value)} : d)}
                        style={{width: '100%'}}
                        min="0.01"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={(editedData as any).public || false} 
                        onChange={e => setEditedData(d => d ? {...d, public: e.target.checked} : d)}
                      />
                    </td>
                    <td>
                      <button className="button button-primary" onClick={saveEdit}>Guardar</button>
                      <button className="button button-ghost" onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={t.id}>
                    <td>
                      <div className="tatuaje-imagen-container">
                        <img src={t.foto || '/placeholder.svg'} className="tatuaje-imagen"/>
                      </div>
                    </td>
                    <td>{t.nombre}</td>
                    <td>{t.estilo}</td>
                    <td>{t.artista}</td>
                    <td>${Number(t.precio).toFixed(2)}</td>
                    <td>{t.public ? 'Sí' : 'No'}</td>
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
                        onChange={e => {
                          if (e.target.files?.[0]) setNewTattoo(n => ({...n!, fotoFile: e.target.files![0]}))
                        }}
                      />
                      {newTattoo.fotoFile ? (
                        <img src={URL.createObjectURL(newTattoo.fotoFile)} className="tatuaje-imagen"/>
                      ) : (
                        <img src="/placeholder.svg" className="tatuaje-imagen"/>
                      )}
                    </div>
                    </td>
                    <td>
                      <input 
                        placeholder="Nombre"
                        value={newTattoo.nombre || ''}
                        onChange={e => setNewTattoo(n => ({...n!, nombre: e.target.value}))}
                      />
                    </td>
                    <td>
                      <select
                        value={newTattoo.estilo || ''}
                        onChange={e => setNewTattoo(n => ({...n!, estilo: e.target.value}))}
                      >
                        <option value="">Seleccionar...</option>
                        {ESTILOS_API.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={newTattoo.artista || ''}
                        onChange={e => setNewTattoo(n => ({...n!, artista: e.target.value}))}
                      >
                        {ARTISTAS_API.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newTattoo.precio || 0}
                        onChange={e => setNewTattoo(n => ({...n!, precio: Number(e.target.value)}))}
                        min="0.01"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={newTattoo.public || false} 
                        onChange={e => setNewTattoo(n => ({...n!, public: e.target.checked}))}
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
      )}
    </div>
  )
}