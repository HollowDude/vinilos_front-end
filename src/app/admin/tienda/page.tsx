"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash } from "lucide-react"
import "../tatuajes/tatuajes.css"
import "./tienda.css"

interface Producto {
  id: number
  nombre: string
  precio: number
  categoria: string
  stock: number
  imagen: string
}

export default function TiendaAdmin() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedProducto, setEditedProducto] = useState<Producto | null>(null)
  const [newProducto, setNewProducto] = useState<Producto | null>(null)

  const categoriasValidas = ["Piercings", "Espansores", "Tattoo", "Cuidados"]

  const soloLetras = (texto: string) => /^[a-zA-Z\s]{2,}$/.test(texto)
  const esImagen = (file: File) => file.type.startsWith("image/")

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setTimeout(() => {
          setProductos([
            {
              id: 1,
              nombre: "Piercing de Titanio",
              precio: 25.99,
              categoria: "Piercings",
              stock: 15,
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 2,
              nombre: "Expansor de Madera",
              precio: 19.99,
              categoria: "Espansores",
              stock: 8,
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 3,
              nombre: "Crema para Cuidado",
              precio: 12.5,
              categoria: "Cuidados",
              stock: 20,
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 4,
              nombre: "Piercing de Acero",
              precio: 15.99,
              categoria: "Piercings",
              stock: 12,
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 5,
              nombre: "Tinta Negra Premium",
              precio: 29.99,
              categoria: "Tattoo",
              stock: 5,
              imagen: "/placeholder.svg?height=400&width=300",
            },
            {
              id: 6,
              nombre: "Kit de Agujas Variadas",
              precio: 45.5,
              categoria: "Tattoo",
              stock: 7,
              imagen: "/placeholder.svg?height=400&width=300",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error al cargar productos:", err)
        setIsLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategoria === "" || producto.categoria === filterCategoria
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProductos(productos.filter((producto) => producto.id !== id))
    }
  }

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id)
    setEditedProducto(producto)
  }

  const handleSaveEdit = async () => {
    if (!editedProducto) return
    if (
      !soloLetras(editedProducto.nombre) ||
      isNaN(editedProducto.precio) ||
      editedProducto.precio <= 0 ||
      !categoriasValidas.includes(editedProducto.categoria) ||
      editedProducto.stock < 0
    ) {
      alert("Revisa que el nombre tenga solo letras (mín. 2), el precio sea válido, la categoría esté seleccionada correctamente y el stock sea positivo.")
      return
    }

    setProductos(productos.map(p => p.id === editedProducto.id ? editedProducto : p))
    setEditingId(null)
    setEditedProducto(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedProducto(null)
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editedProducto) {
      const file = e.target.files[0]
      if (!esImagen(file)) {
        alert("El archivo debe ser una imagen válida.")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setEditedProducto({ ...editedProducto, imagen: imageUrl })
    }
  }

  const handleNew = () => {
    if (newProducto) return
    setNewProducto({
      id: 0,
      nombre: "",
      precio: 0,
      categoria: "",
      stock: 0,
      imagen: "",
    })
  }

  const handleSaveNew = async () => {
    if (!newProducto) return
    if (
      !soloLetras(newProducto.nombre) ||
      isNaN(newProducto.precio) ||
      newProducto.precio <= 0 ||
      !categoriasValidas.includes(newProducto.categoria) ||
      newProducto.stock < 0
    ) {
      alert("Revisa que el nombre tenga solo letras (mín. 2), el precio sea válido, la categoría esté seleccionada correctamente y el stock sea positivo.")
      return
    }

    const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1
    const createdProducto = { ...newProducto, id: newId }
    setProductos([...productos, createdProducto])
    setNewProducto(null)
  }

  const handleCancelNew = () => {
    setNewProducto(null)
  }

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && newProducto) {
      const file = e.target.files[0]
      if (!esImagen(file)) {
        alert("El archivo debe ser una imagen válida.")
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setNewProducto({ ...newProducto, imagen: imageUrl })
    }
  }

  return (
    <div className="tienda-admin">
      <div className="tienda-header">
        <h1 className="tienda-title">Administrar Tienda</h1>
        <button className="button button-primary" onClick={handleNew}>
          <Plus size={16} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="tienda-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categoriasValidas.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="tienda-loading">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <div className="productos-grid">
          {filteredProductos.length > 0 ? (
            filteredProductos.map((producto) =>
              editingId === producto.id && editedProducto ? (
                <div key={producto.id} className="producto-card">
                  <div className="producto-imagen-container">
                    <img
                      src={editedProducto.imagen || "/placeholder.svg"}
                      alt={editedProducto.nombre}
                      className="producto-imagen"
                    />
                    <input type="file" accept="image/*" onChange={handleEditFileChange} />
                  </div>
                  <div className="producto-content">
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      value={editedProducto.nombre}
                      onChange={(e) =>
                        setEditedProducto({
                          ...editedProducto,
                          nombre: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      value={editedProducto.precio || ""}
                      onChange={(e) =>
                        setEditedProducto({
                          ...editedProducto,
                          precio: Number(e.target.value),
                        })
                      }
                    />
                    <select
                      style={{ width: "100%" }}
                      value={editedProducto.categoria}
                      onChange={(e) =>
                        setEditedProducto({ ...editedProducto, categoria: e.target.value })
                      }
                    >
                      <option value="">Seleccione categoría</option>
                      {categoriasValidas.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      value={editedProducto.stock || ""}
                      onChange={(e) =>
                        setEditedProducto({
                          ...editedProducto,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="producto-actions">
                    <button className="button button-primary" onClick={handleSaveEdit}>
                      Aceptar
                    </button>
                    <button className="button button-icon button-danger" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div key={producto.id} className="producto-card">
                  <div className="producto-imagen-container">
                    <img
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      className="producto-imagen"
                    />
                    <div className="producto-stock">Stock: {producto.stock}</div>
                  </div>
                  <div className="producto-content">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-categoria">{producto.categoria}</p>
                    <p className="producto-precio">{producto.precio.toFixed(2)} CUP</p>
                  </div>
                  <div className="producto-actions">
                    <button className="button button-icon" onClick={() => handleEdit(producto)}>
                      <Edit size={16} />
                    </button>
                    <button className="button button-icon button-danger" onClick={() => handleDelete(producto.id)}>
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="productos-empty">No se encontraron productos</div>
          )}

          {newProducto && (
            <div className="producto-card">
              <div className="producto-imagen-container">
                {newProducto.imagen ? (
                  <img
                    src={newProducto.imagen}
                    alt="Preview"
                    className="producto-imagen"
                  />
                ) : (
                  <img src="/placeholder.svg" alt="Placeholder" className="producto-imagen" />
                )}
                <input type="file" accept="image/*" onChange={handleNewFileChange} />
              </div>
              <div className="producto-content">
                <input
                  type="text"
                  style={{ width: "100%" }}
                  placeholder="Nombre"
                  value={newProducto.nombre}
                  onChange={(e) =>
                    setNewProducto({ ...newProducto, nombre: e.target.value })
                  }
                />
                <input
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="Precio"
                  value={newProducto.precio || ""}
                  onChange={(e) =>
                    setNewProducto({ ...newProducto, precio: Number(e.target.value) })
                  }
                />
                <select
                  style={{ width: "100%" }}
                  value={newProducto.categoria}
                  onChange={(e) =>
                    setNewProducto({ ...newProducto, categoria: e.target.value })
                  }
                >
                  <option value="">Seleccione categoría</option>
                  {categoriasValidas.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="Stock"
                  value={newProducto.stock || ""}
                  onChange={(e) =>
                    setNewProducto({ ...newProducto, stock: Number(e.target.value) })
                  }
                />
              </div>
              <div className="producto-actions">
                <button className="button button-primary" onClick={handleSaveNew}>
                  Aceptar
                </button>
                <button className="button button-icon button-danger" onClick={handleCancelNew}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
