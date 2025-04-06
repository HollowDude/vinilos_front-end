"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import "./materiales.css"

interface Material {
  id: number
  nombre: string
  tipo: string
  cantidad: number
  fecha_uso: string
}

export default function MaterialesAdmin() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("")

  // Estado para crear un nuevo material
  const [newMaterial, setNewMaterial] = useState<Material | null>(null)

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        // En un caso real, esto sería una llamada a la API:
        // const response = await fetch('/api/materiales')
        // const data = await response.json()

        // Simulamos datos para el ejemplo
        setTimeout(() => {
          setMateriales([
            {
              id: 1,
              nombre: "Tinta negra",
              tipo: "Tinta",
              cantidad: 50,
              fecha_uso: "2023-05-15",
            },
            {
              id: 2,
              nombre: "Agujas 3RL",
              tipo: "Aguja",
              cantidad: 5,
              fecha_uso: "2023-05-16",
            },
            {
              id: 3,
              nombre: "Guantes de látex",
              tipo: "Protección",
              cantidad: 2,
              fecha_uso: "2023-05-17",
            },
            {
              id: 4,
              nombre: "Piercing de titanio",
              tipo: "Piercing",
              cantidad: 1,
              fecha_uso: "2023-05-18",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar materiales:", err)
        setIsLoading(false)
      }
    }

    fetchMateriales()
  }, [])

  const filteredMateriales = materiales.filter((material) => {
    const matchesSearch = material.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterTipo === "" || material.tipo === filterTipo
    return matchesSearch && matchesFilter
  })

  const tipos = [...new Set(materiales.map((material) => material.tipo))]

  // Inicia la creación de un nuevo material
  const handleNew = () => {
    if (newMaterial) return
    setNewMaterial({
      id: 0, // id temporal; en un caso real la API asignaría el id
      nombre: "",
      tipo: "",
      cantidad: 0,
      fecha_uso: "",
    })
  }

  const validateTextField = (text: string): boolean => {
    return /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(text.trim())
  }
  
  // Guarda el nuevo material con validaciones actualizadas
  const handleSaveNew = async () => {
    if (!newMaterial) return
  
    const { nombre, tipo, cantidad, fecha_uso } = newMaterial
  
    if (
      !validateTextField(nombre) ||
      !validateTextField(tipo) ||
      !fecha_uso.trim() ||
      cantidad <= 0
    ) {
      alert("Nombre y tipo deben tener al menos 3 letras y solo pueden contener letras o espacios. Además, la cantidad debe ser mayor a 0.")
      return
    }
  
    if (new Date(fecha_uso) > new Date()) {
      alert("La fecha de uso no puede ser mayor a la actual.")
      return
    }
  
    const newId = materiales.length > 0 ? Math.max(...materiales.map(m => m.id)) + 1 : 1
    const createdMaterial = { ...newMaterial, id: newId }
    setMateriales([...materiales, createdMaterial])
    setNewMaterial(null)
  }

  // Cancela la creación
  const handleCancelNew = () => {
    setNewMaterial(null)
  }

  return (
    <div className="materiales-admin">
      <div className="materiales-header">
        <h1 className="materiales-title">Uso de Materiales</h1>
        <button className="button button-primary" onClick={handleNew}>
          <Plus size={16} />
          <span>Registrar Uso</span>
        </button>
      </div>

      <div className="materiales-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar materiales..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select className="filter-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="materiales-loading">
          <div className="loading-spinner"></div>
          <p>Cargando registros...</p>
        </div>
      ) : (
        <div className="materiales-table-container">
          <table className="materiales-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Fecha de Uso</th>
              </tr>
            </thead>
            <tbody>
              {filteredMateriales.length > 0 ? (
                filteredMateriales.map((material) => (
                  <tr key={material.id}>
                    <td>{material.nombre}</td>
                    <td>{material.tipo}</td>
                    <td>{material.cantidad}</td>
                    <td>{new Date(material.fecha_uso).toLocaleDateString("es-ES")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="materiales-empty">
                    No se encontraron registros
                  </td>
                </tr>
              )}

              {/* Fila para crear un nuevo material */}
              {newMaterial && (
                <tr>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Nombre"
                      value={newMaterial.nombre}
                      onChange={(e) => setNewMaterial({ ...newMaterial, nombre: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      placeholder="Tipo"
                      value={newMaterial.tipo}
                      onChange={(e) => setNewMaterial({ ...newMaterial, tipo: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Cantidad"
                      value={newMaterial.cantidad || ""}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, cantidad: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      style={{ width: "100%" }}
                      value={newMaterial.fecha_uso}
                      onChange={(e) => setNewMaterial({ ...newMaterial, fecha_uso: e.target.value })}
                    />
                  </td>
                  <td>
                    <div className="material-acciones">
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
