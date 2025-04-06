"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import "../tatuajes/tatuajes.css"

interface Piercing {
  id: number
  titulo: string
  artista: string
  ubicacion: string
  fecha: string
  imagen: string
}

export default function PiercingsAdmin() {
  const [piercings, setPiercings] = useState<Piercing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUbicacion, setFilterUbicacion] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Piercing | null>(null)

  const [newPiercing, setNewPiercing] = useState<Piercing | null>(null)

  useEffect(() => {
    const fetchPiercings = async () => {
      setTimeout(() => {
        setPiercings([
          {
            id: 1,
            titulo: "Septum",
            artista: "Marisney Elvira Rivero",
            ubicacion: "Nariz",
            fecha: "2023-05-20",
            imagen: "/placeholder.svg?height=400&width=300",
          },
          {
            id: 2,
            titulo: "Industrial",
            artista: "Marisney Elvira Rivero",
            ubicacion: "Oreja",
            fecha: "2023-06-15",
            imagen: "/placeholder.svg?height=400&width=300",
          },
          {
            id: 3,
            titulo: "Labret",
            artista: "Marisney Elvira Rivero",
            ubicacion: "Labio",
            fecha: "2023-07-05",
            imagen: "/placeholder.svg?height=400&width=300",
          },
          {
            id: 4,
            titulo: "Helix",
            artista: "Marisney Elvira Rivero",
            ubicacion: "Oreja",
            fecha: "2023-08-10",
            imagen: "/placeholder.svg?height=400&width=300",
          },
        ])
        setIsLoading(false)
      }, 1000)
    }

    fetchPiercings()
  }, [])

  const filteredPiercings = piercings.filter((piercing) => {
    const matchesSearch =
      piercing.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piercing.artista.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterUbicacion === "" || piercing.ubicacion === filterUbicacion

    return matchesSearch && matchesFilter
  })

  const ubicaciones = [...new Set(piercings.map((piercing) => piercing.ubicacion))]

  const validateText = (text: string): boolean => {
    return /^[A-ZÁÉÍÓÚÑ][a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{1,}$/.test(text)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este piercing?")) {
      setPiercings(piercings.filter((piercing) => piercing.id !== id))
    }
  }

  const handleEdit = (piercing: Piercing) => {
    setEditingId(piercing.id)
    setEditedData(piercing)
  }

  const handleSaveEdit = async () => {
    if (!editedData) return

    if (
      !validateText(editedData.titulo.trim()) ||
      !validateText(editedData.ubicacion.trim()) ||
      !editedData.fecha.trim()
    ) {
      alert("Revisa los campos: Título y Ubicación deben iniciar con mayúscula, tener al menos 2 letras y no contener solo símbolos o números.")
      return
    }

    if (new Date(editedData.fecha) > new Date()) {
      alert("La fecha no puede ser mayor a la actual.")
      return
    }

    setPiercings(piercings.map(p => p.id === editedData.id ? editedData : p))
    setEditingId(null)
    setEditedData(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedData(null)
  }

  const handleNew = () => {
    if (newPiercing) return
    setNewPiercing({
      id: 0,
      titulo: "",
      artista: "Marisney Elvira Rivero",
      ubicacion: "",
      fecha: "",
      imagen: "",
    })
  }

  const handleSaveNew = async () => {
    if (!newPiercing) return

    if (
      !validateText(newPiercing.titulo.trim()) ||
      !validateText(newPiercing.ubicacion.trim()) ||
      !newPiercing.fecha.trim()
    ) {
      alert("Revisa los campos: Título y Ubicación deben iniciar con mayúscula, tener al menos 2 letras y no contener solo símbolos o números.")
      return
    }

    if (new Date(newPiercing.fecha) > new Date()) {
      alert("La fecha no puede ser mayor a la actual.")
      return
    }

    const newId = piercings.length > 0 ? Math.max(...piercings.map(p => p.id)) + 1 : 1
    const createdPiercing = { ...newPiercing, id: newId }

    setPiercings([...piercings, createdPiercing])
    setNewPiercing(null)
  }

  const handleCancelNew = () => {
    setNewPiercing(null)
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editedData) {
      const file = e.target.files[0]
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen.")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setEditedData({ ...editedData, imagen: imageUrl })
    }
  }

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && newPiercing) {
      const file = e.target.files[0]
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen.")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setNewPiercing({ ...newPiercing, imagen: imageUrl })
    }
  }

  return (
    <div className="tatuajes-admin">
      <div className="tatuajes-header">
        <h1 className="tatuajes-title">Administrar Piercings</h1>
        <button className="button button-primary" onClick={handleNew}>
          <Plus size={16} />
          <span>Nuevo Piercing</span>
        </button>
      </div>

      <div className="tatuajes-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar piercings..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterUbicacion}
            onChange={(e) => setFilterUbicacion(e.target.value)}
          >
            <option value="">Todas las ubicaciones</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion} value={ubicacion}>
                {ubicacion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="tatuajes-loading">
          <div className="loading-spinner"></div>
          <p>Cargando piercings...</p>
        </div>
      ) : (
        <div className="tatuajes-table-container">
          <table className="tatuajes-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Artista</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPiercings.length > 0 ? (
                filteredPiercings.map((piercing) => (
                  <tr key={piercing.id}>
                    <td>
                      {editingId === piercing.id ? (
                        <div>
                          <img
                            src={editedData?.imagen || "/placeholder.svg"}
                            alt={editedData?.titulo || "Imagen"}
                            className="tatuaje-imagen"
                          />
                          <input type="file" accept="image/*" onChange={handleEditFileChange} />
                        </div>
                      ) : (
                        <div className="tatuaje-imagen-container">
                          <img
                            src={piercing.imagen || "/placeholder.svg"}
                            alt={piercing.titulo}
                            className="tatuaje-imagen"
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === piercing.id ? (
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          value={editedData?.titulo || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, titulo: e.target.value } : null
                            )
                          }
                        />
                      ) : (
                        piercing.titulo
                      )}
                    </td>
                    <td>
                      {editingId === piercing.id ? (
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          value={editedData?.artista || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, artista: e.target.value } : null
                            )
                          }
                        />
                      ) : (
                        piercing.artista
                      )}
                    </td>
                    <td>
                      {editingId === piercing.id ? (
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          value={editedData?.ubicacion || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, ubicacion: e.target.value } : null
                            )
                          }
                        />
                      ) : (
                        piercing.ubicacion
                      )}
                    </td>
                    <td>
                      {editingId === piercing.id ? (
                        <input
                          type="date"
                          style={{ width: "100%" }}
                          value={editedData?.fecha || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, fecha: e.target.value } : null
                            )
                          }
                        />
                      ) : (
                        new Date(piercing.fecha).toLocaleDateString("es-ES")
                      )}
                    </td>
                    <td>
                      <div className="tatuaje-acciones">
                        {editingId === piercing.id ? (
                          <>
                            <button className="button button-primary" onClick={handleSaveEdit}>
                              Aceptar
                            </button>
                            <button className="button button-icon button-danger" onClick={handleCancelEdit}>
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="button button-icon" onClick={() => handleEdit(piercing)}>
                              <Edit size={16} />
                            </button>
                            <button className="button button-icon button-danger" onClick={() => handleDelete(piercing.id)}>
                              <Trash size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="tatuajes-empty">
                    No se encontraron piercings
                  </td>
                </tr>
              )}

              {/* Fila para crear un nuevo piercing */}
              {newPiercing && (
                <tr>
                  <td>
                    <div>
                      {newPiercing.imagen ? (
                        <img
                          src={newPiercing.imagen}
                          alt="Preview"
                          className="tatuaje-imagen"
                        />
                      ) : (
                        <div className="tatuaje-imagen-container">
                          <img src="/placeholder.svg" alt="Placeholder" className="tatuaje-imagen" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleNewFileChange} />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Título"
                      value={newPiercing.titulo}
                      onChange={(e) =>
                        setNewPiercing({ ...newPiercing, titulo: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Artista"
                      value={newPiercing.artista}
                      onChange={(e) =>
                        setNewPiercing({ ...newPiercing, artista: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Ubicación"
                      value={newPiercing.ubicacion}
                      onChange={(e) =>
                        setNewPiercing({ ...newPiercing, ubicacion: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      style={{ width: "100%" }}
                      value={newPiercing.fecha}
                      onChange={(e) =>
                        setNewPiercing({ ...newPiercing, fecha: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <div className="tatuaje-acciones">
                      <button className="button button-primary" onClick={handleSaveNew}>
                        Aceptar
                      </button>
                      <button className="button button-icon button-danger" onClick={handleCancelNew}>
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
