// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './proveedores.css';

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        tipoProveedor: '',
        estado: 'Activo',
        fechaRegistro: '' // Nuevo campo para la fecha
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProveedorId, setEditingProveedorId] = useState(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/proveedores');
                console.log('Datos recibidos:', response.data); // Depuración
                setProveedores(response.data);
            } catch (err) {
                console.error('Error al cargar proveedores:', err);
            }
        };
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/proveedores/${editingProveedorId}`, formData);
                setIsEditing(false);
                setEditingProveedorId(null);
            } else {
                await axios.post('http://localhost:3001/api/proveedores', formData);
            }
            setShowForm(false);
            setFormData({ nombre: '', direccion: '', telefono: '', email: '', tipoProveedor: '', estado: 'Activo', fechaRegistro: '' });
            setError(null);

            // Refrescar la lista de proveedores
            const response = await axios.get('http://localhost:3001/api/proveedores');
            setProveedores(response.data);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error al registrar o actualizar proveedor');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/proveedores/${id}`);
            setProveedores(proveedores.filter((proveedor) => proveedor.idProveedor !== id));
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error al eliminar proveedor');
        }
    };

    const handleEdit = (proveedor) => {
        setFormData({
            nombre: proveedor.Nombre,
            direccion: proveedor.Direccion,
            telefono: proveedor.Telefono,
            email: proveedor.Email,
            tipoProveedor: proveedor.TipoProveedor,
            estado: proveedor.Estado || 'Inactivo',
            fechaRegistro: proveedor.FechaRegistro ? proveedor.FechaRegistro.slice(0, 10) : ''
        });
        setIsEditing(true);
        setEditingProveedorId(proveedor.idProveedor);
        setShowForm(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="proveedores-section-container">
      <div className="proveedores-header-container">
        <h1>Gestión de Proveedores</h1>
        <button
          className="proveedores-add-button"
          onClick={() => setShowForm(!showForm)}
        >
          Agregar Proveedor
        </button>
      </div>
      <div className="proveedores-search-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="proveedores-search-input"
        />
      </div>

      {showForm && (
        <div className="proveedores-form-container">
          <h2>{isEditing ? "Editar Proveedor" : "Registrar Proveedor"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="proveedores-form-input"
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="proveedores-form-input"
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="proveedores-form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className="proveedores-form-input"
            />
            <input
              type="text"
              name="tipoProveedor"
              placeholder="Tipo de Proveedor"
              value={formData.tipoProveedor}
              onChange={handleChange}
              className="proveedores-form-input"
            />
            <input
              type="date"
              name="fechaRegistro"
              value={formData.fechaRegistro}
              onChange={handleChange}
              className="proveedores-form-input"
            />
            <button type="submit" className="proveedores-form-submit-btn">
              {isEditing ? "Actualizar" : "Registrar"}
            </button>
            <button
              type="button"
              className="proveedores-form-cancel-btn"
              onClick={handleChange}
            >
              Cancelar
            </button>
          </form>
          {error && <p className="proveedores-error-message">{error}</p>}
        </div>
      )}

      <table className="proveedores-data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Tipo Proveedor</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProveedores.map((proveedor) => (
            <tr key={proveedor.idProveedor}>
              <td>{proveedor.Nombre}</td>
              <td>{proveedor.Direccion}</td>
              <td>{proveedor.Telefono}</td>
              <td>{proveedor.Email}</td>
              <td>{proveedor.TipoProveedor}</td>
              <td>
                {proveedor.FechaRegistro
                  ? proveedor.FechaRegistro.slice(0, 10)
                  : ""}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(proveedor)}
                  className="proveedores-action-button proveedores-button_edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(proveedor.idProveedor)}
                  className="proveedores-action-button proveedores-button_delete"
                >
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

export default Proveedores;