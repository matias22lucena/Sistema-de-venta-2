// src/pages/Usuarios.jsx
import React, { useState, useEffect } from "react"; // Importa React y hooks de estado y efectos
import axios from "axios"; // Importa Axios para hacer peticiones HTTP
import "./usuario.css"; // Importa el archivo CSS para estilizar el componente

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar la lista de usuarios
  const [searchTerm, setSearchTerm] = useState(""); // Estado para almacenar el término de búsqueda
  const [showForm, setShowForm] = useState(false); // Estado para controlar si el formulario de agregar/editar usuario está visible
  const [formData, setFormData] = useState({
    documento: "",
    nombreCompleto: "",
    correo: "",
    telefono: "",
    clave: "",
    idRol: "",
  });
  const [error, setError] = useState(null); // Estado para almacenar errores de operación
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando un usuario
  const [editingUserId, setEditingUserId] = useState(null); // Estado para almacenar el ID del usuario que se está editando

  // useEffect se usa para cargar los usuarios desde la API cuando el componente se monta
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/usuarios");
        console.log(response.data); // Verifica los datos de la respuesta
        setUsuarios(response.data); // Almacena los usuarios obtenidos en el estado
      } catch (err) {
        console.error("Error al cargar usuarios:", err); // Maneja el error si no se puede cargar
      }
    };
    fetchUsuarios(); // Llama a la función de carga de usuarios
  }, []); // El array vacío asegura que se ejecute solo una vez, al montar el componente

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualiza el estado con el nuevo valor
  };

  // Función para manejar los cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el estado con el término de búsqueda
  };

  // Función para manejar el envío del formulario (registrar o editar)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    try {
      if (isEditing) {
        // Si estamos editando un usuario, hacemos una petición PUT
        await axios.put(
          `http://localhost:3001/api/usuarios/${editingUserId}`,
          formData
        );
        setIsEditing(false); // Cambia el estado para no estar en modo de edición
        setEditingUserId(null); // Limpia el ID de edición
      } else {
        // Si estamos registrando un nuevo usuario, hacemos una petición POST
        await axios.post("http://localhost:3001/api/usuarios", formData);
      }

      setShowForm(false); // Cierra el formulario después de registrar o editar
      setFormData({
        documento: "",
        nombreCompleto: "",
        correo: "",
        telefono: "",
        clave: "",
        idRol: "",
      });
      setError(null); // Limpia el estado de errores

      // Vuelve a cargar la lista de usuarios
      const response = await axios.get("http://localhost:3001/api/usuarios");
      setUsuarios(response.data);
    } catch (err) {
      setError("Error al registrar o actualizar usuario"); // Muestra el error si hay alguno
    }
  };

  // Función para manejar la eliminación de un usuario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((usuario) => usuario.idUsuario !== id)); // Elimina el usuario de la lista en el estado
    } catch (err) {
      console.error("Error al eliminar usuario:", err); // Maneja el error si no se puede eliminar
    }
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario) => {
    setFormData({
      documento: usuario.Documento,
      nombreCompleto: usuario.NombreCompleto,
      correo: usuario.Correo,
      telefono: usuario.Telefono,
      clave: usuario.Clave,
      idRol: usuario.idRol,
    });
    setShowForm(true); // Muestra el formulario para editar
    setIsEditing(true); // Marca el formulario como modo de edición
    setEditingUserId(usuario.idUsuario); // Almacena el ID del usuario que estamos editando
  };

  // Función para manejar el botón de cancelar
  const handleCancel = () => {
    setShowForm(false); // Cierra el formulario sin guardar
    setFormData({
      documento: "",
      nombreCompleto: "",
      correo: "",
      telefono: "",
      clave: "",
      idRol: "",
    });
    setError(null); // Limpia el error
    setIsEditing(false); // Asegura que no esté en modo de edición
  };

  // Filtrar usuarios según el término de búsqueda (ignora mayúsculas y minúsculas)
  const filteredUsuarios = searchTerm
    ? usuarios.filter((usuario) =>
        Object.values(usuario)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : usuarios; // Si no hay término de búsqueda, muestra todos los usuarios

  return (
    <div className="section-container-Usuario">
      <nav className="navbar">
        <ul>
          <li>
            <a href="/home">Inicio</a>
          </li>
        </ul>
      </nav>

      <div className="header-container">
        <div className="left-side">
          <h1>Gestión de Usuarios</h1>
          <button className="add-button" onClick={() => setShowForm(!showForm)}>
            Agregar Usuario
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscador"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{isEditing ? "Editar Usuario" : "Registrar Usuario"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="documento"
              placeholder="Documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nombreCompleto"
              placeholder="Nombre Completo"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={formData.correo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <input
              type="password"
              name="clave"
              placeholder="Contraseña"
              value={formData.clave}
              onChange={handleChange}
              required
            />
            <select
              name="idRol"
              value={formData.idRol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="1">Admin</option>
              <option value="2">Empleado</option>
            </select>
            <button type="submit">
              {isEditing ? "Actualizar" : "Registrar"}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancelar
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.idUsuario}>
              <td>{usuario.idUsuario}</td>
              <td>{usuario.NombreCompleto}</td>
              <td>{usuario.Correo}</td>
              <td>{usuario.Telefono}</td>
              <td>{usuario.Rol}</td>
              <td>
                <button className="button_edit" onClick={() => handleEdit(usuario)}>
                  Editar
                </button>
                <button className="button_delete" onClick={() => handleDelete(usuario.idUsuario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
