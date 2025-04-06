"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import "./tatuajes.css"

interface Tatuaje {
  id: number
  titulo: string
  precio: number
  artista: string
  estilo: string
  fecha: string
  imagen: string
}

const ARTISTAS = [
  "Xavier Verdecie Ramos",
  "Osmel Barrio Betancourt"
]

export default function TatuajesAdmin() {
  const [tatuajes, setTatuajes] = useState<Tatuaje[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstilo, setFilterEstilo] = useState("")

  // Estados para edición en línea
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Tatuaje | null>(null)

  // Estado para crear un nuevo tatuaje
  const [newTatuaje, setNewTatuaje] = useState<Tatuaje | null>(null)

  // Validaciones
  const validateTexto = (texto: string): boolean => {
    // Verifica que empiece con mayúscula, tenga al menos 2 letras y no sean solo números/signos
    return /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s]{1,}$/.test(texto)
  }

  const validateImagen = (file: File | null): boolean => {
    if (!file) return false
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    return acceptedTypes.includes(file.type)
  }

  useEffect(() => {
    const fetchTatuajes = async () => {
      try {
        // En un caso real, esto sería una llamada a la API
        // const response = await fetch('/api/tatuajes')
        // const data = await response.json()

        // Simulamos datos para el ejemplo
        setTimeout(() => {
          setTatuajes([
            {
              id: 1,
              titulo: "Dragón Japonés",
              precio: 1500,
              artista: "Carlos Mendez",
              estilo: "Tradicional Japonés",
              fecha: "2023-05-15",
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 2,
              titulo: "Mandala Geométrico",
              precio: 1200,
              artista: "Laura Sánchez",
              estilo: "Geométrico",
              fecha: "2023-06-22",
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 3,
              titulo: "Retrato Realista",
              precio: 1500,
              artista: "Miguel Torres",
              estilo: "Realismo",
              fecha: "2023-07-10",
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 4,
              titulo: "Old School Anchor",
              precio: 2000,
              artista: "Carlos Mendez",
              estilo: "Old School",
              fecha: "2023-08-05",
              imagen: "/placeholder.svg?height=400&width=300",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar tatuajes:", err)
        setIsLoading(false)
      }
    }

    fetchTatuajes()
  }, [])

  const filteredTatuajes = tatuajes.filter((tatuaje) => {
    const matchesSearch =
      tatuaje.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tatuaje.artista.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterEstilo === "" || tatuaje.estilo === filterEstilo

    return matchesSearch && matchesFilter
  })

  const estilos = [...new Set(tatuajes.map((tatuaje) => tatuaje.estilo))]

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este tatuaje?")) {
      // En un caso real, se haría una llamada a la API:
      // await fetch(`/api/tatuajes/${id}`, { method: 'DELETE' })
      setTatuajes(tatuajes.filter((tatuaje) => tatuaje.id !== id))
    }
  }

  // Inicia la edición de un tatuaje
  const handleEdit = (tatuaje: Tatuaje) => {
    setEditingId(tatuaje.id)
    setEditedData(tatuaje)
  }

  // Guarda los cambios de edición con validaciones básicas
  const handleSaveEdit = async () => {
    if (!editedData) return

    // Validaciones
    if (
      !editedData.titulo.trim() ||
      !editedData.artista.trim() ||
      !editedData.estilo.trim() ||
      !editedData.fecha.trim() ||
      editedData.precio <= 0
    ) {
      alert("Todos los campos son obligatorios y el precio debe ser mayor a 0.")
      return
    }

    if (!validateTexto(editedData.titulo)) {
      alert("El título debe comenzar con mayúscula y tener al menos 2 caracteres válidos.")
      return
    }

    if (!validateTexto(editedData.estilo)) {
      alert("El estilo debe comenzar con mayúscula y tener al menos 2 caracteres válidos.")
      return
    }

    if (!ARTISTAS.includes(editedData.artista)) {
      alert("Por favor selecciona un artista válido de la lista.")
      return
    }

    if (new Date(editedData.fecha) > new Date()) {
      alert("La fecha no puede ser mayor a la actual.")
      return
    }

    setTatuajes(tatuajes.map(t => t.id === editedData.id ? editedData : t))
    setEditingId(null)
    setEditedData(null)
  }

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedData(null)
  }

  // Inicia la creación de un nuevo tatuaje con campos vacíos
  const handleNew = () => {
    if (newTatuaje) return
    setNewTatuaje({
      id: 0,
      titulo: "",
      precio: 0,
      artista: ARTISTAS[0], // Valor por defecto
      estilo: "",
      fecha: "",
      imagen: "",
    })
  }

  // Guarda el nuevo tatuaje con validaciones básicas
  const handleSaveNew = async () => {
    if (!newTatuaje) return

    if (
      !newTatuaje.titulo.trim() ||
      !newTatuaje.artista.trim() ||
      !newTatuaje.estilo.trim() ||
      !newTatuaje.fecha.trim() ||
      newTatuaje.precio <= 0
    ) {
      alert("Todos los campos son obligatorios y el precio debe ser mayor a 0.")
      return
    }

    if (!validateTexto(newTatuaje.titulo)) {
      alert("El título debe comenzar con mayúscula y tener al menos 2 caracteres válidos.")
      return
    }

    if (!validateTexto(newTatuaje.estilo)) {
      alert("El estilo debe comenzar con mayúscula y tener al menos 2 caracteres válidos.")
      return
    }

    if (!ARTISTAS.includes(newTatuaje.artista)) {
      alert("Por favor selecciona un artista válido de la lista.")
      return
    }

    if (new Date(newTatuaje.fecha) > new Date()) {
      alert("La fecha no puede ser mayor a la actual.")
      return
    }

    if (!newTatuaje.imagen) {
      alert("Por favor sube una imagen válida para el tatuaje.")
      return
    }

    const newId = tatuajes.length > 0 ? Math.max(...tatuajes.map(t => t.id)) + 1 : 1
    const createdTatuaje = { ...newTatuaje, id: newId }
    setTatuajes([...tatuajes, createdTatuaje])
    setNewTatuaje(null)
  }

  // Cancela la creación
  const handleCancelNew = () => {
    setNewTatuaje(null)
  }

  // Maneja la carga de imagen en edición
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editedData) {
      const file = e.target.files[0]
      if (!validateImagen(file)) {
        alert("Por favor sube un archivo de imagen válido (JPEG, PNG, GIF o WEBP).")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setEditedData({ ...editedData, imagen: imageUrl })
    }
  }

  // Maneja la carga de imagen en creación
  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && newTatuaje) {
      const file = e.target.files[0]
      if (!validateImagen(file)) {
        alert("Por favor sube un archivo de imagen válido (JPEG, PNG, GIF o WEBP).")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setNewTatuaje({ ...newTatuaje, imagen: imageUrl })
    }
  }

  return (
    <div className="tatuajes-admin">
      <div className="tatuajes-header">
        <h1 className="tatuajes-title">Administrar Tatuajes</h1>
        <button className="button button-primary" onClick={handleNew}>
          <Plus size={16} />
          <span>Nuevo Tatuaje</span>
        </button>
      </div>

      <div className="tatuajes-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar tatuajes..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterEstilo}
            onChange={(e) => setFilterEstilo(e.target.value)}
          >
            <option value="">Todos los estilos</option>
            {estilos.map((estilo) => (
              <option key={estilo} value={estilo}>
                {estilo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="tatuajes-loading">
          <div className="loading-spinner"></div>
          <p>Cargando tatuajes...</p>
        </div>
      ) : (
        <div className="tatuajes-table-container">
          <table className="tatuajes-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Artista</th>
                <th>Estilo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTatuajes.length > 0 ? (
                filteredTatuajes.map((tatuaje) => (
                  <tr key={tatuaje.id}>
                    <td>
                      {editingId === tatuaje.id ? (
                        <div>
                          <img
                            src={editedData?.imagen || "/placeholder.svg"}
                            alt={editedData?.titulo || "Imagen"}
                            className="tatuaje-imagen"
                          />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleEditFileChange} 
                            required
                          />
                        </div>
                      ) : (
                        <div className="tatuaje-imagen-container">
                          <img
                            src={tatuaje.imagen || "/placeholder.svg"}
                            alt={tatuaje.titulo}
                            className="tatuaje-imagen"
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === tatuaje.id ? (
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          value={editedData?.titulo || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, titulo: e.target.value } : null
                            )
                          }
                          required
                        />
                      ) : (
                        tatuaje.titulo
                      )}
                    </td>
                    <td>
                      {editingId === tatuaje.id ? (
                        <input
                          type="number"
                          style={{ width: "100%" }}
                          value={editedData?.precio || 0}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, precio: Number(e.target.value) } : null
                            )
                          }
                          min="1"
                          required
                        />
                      ) : (
                        tatuaje.precio
                      )}
                    </td>
                    <td>
                      {editingId === tatuaje.id ? (
                        <select
                          style={{ width: "100%" }}
                          value={editedData?.artista || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, artista: e.target.value } : null
                            )
                          }
                          required
                        >
                          {ARTISTAS.map(artista => (
                            <option key={artista} value={artista}>{artista}</option>
                          ))}
                        </select>
                      ) : (
                        tatuaje.artista
                      )}
                    </td>
                    <td>
                      {editingId === tatuaje.id ? (
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          value={editedData?.estilo || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, estilo: e.target.value } : null
                            )
                          }
                          required
                        />
                      ) : (
                        tatuaje.estilo
                      )}
                    </td>
                    <td>
                      {editingId === tatuaje.id ? (
                        <input
                          type="date"
                          style={{ width: "100%" }}
                          value={editedData?.fecha || ""}
                          onChange={(e) =>
                            setEditedData(
                              editedData ? { ...editedData, fecha: e.target.value } : null
                            )
                          }
                          required
                        />
                      ) : (
                        new Date(tatuaje.fecha).toLocaleDateString("es-ES")
                      )}
                    </td>
                    <td>
                      <div className="tatuaje-acciones">
                        {editingId === tatuaje.id ? (
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
                            <button className="button button-icon" onClick={() => handleEdit(tatuaje)}>
                              <Edit size={16} />
                            </button>
                            <button className="button button-icon button-danger" onClick={() => handleDelete(tatuaje.id)}>
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
                  <td colSpan={7} className="tatuajes-empty">
                    No se encontraron tatuajes
                  </td>
                </tr>
              )}

              {/* Fila para crear un nuevo tatuaje */}
              {newTatuaje && (
                <tr>
                  <td>
                    <div>
                      {newTatuaje.imagen ? (
                        <img
                          src={newTatuaje.imagen}
                          alt="Preview"
                          className="tatuaje-imagen"
                        />
                      ) : (
                        <div className="tatuaje-imagen-container">
                          <img src="/placeholder.svg" alt="Placeholder" className="tatuaje-imagen" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleNewFileChange} 
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Título"
                      value={newTatuaje.titulo}
                      onChange={(e) =>
                        setNewTatuaje({ ...newTatuaje, titulo: e.target.value })
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Precio"
                      value={newTatuaje.precio || ""}
                      onChange={(e) =>
                        setNewTatuaje({ ...newTatuaje, precio: Number(e.target.value) })
                      }
                      min="1"
                      required
                    />
                  </td>
                  <td>
                    <select
                      style={{ width: "100%" }}
                      value={newTatuaje.artista}
                      onChange={(e) =>
                        setNewTatuaje({ ...newTatuaje, artista: e.target.value })
                      }
                      required
                    >
                      {ARTISTAS.map(artista => (
                        <option key={artista} value={artista}>{artista}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Estilo"
                      value={newTatuaje.estilo}
                      onChange={(e) =>
                        setNewTatuaje({ ...newTatuaje, estilo: e.target.value })
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      style={{ width: "100%" }}
                      value={newTatuaje.fecha}
                      onChange={(e) =>
                        setNewTatuaje({ ...newTatuaje, fecha: e.target.value })
                      }
                      required
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