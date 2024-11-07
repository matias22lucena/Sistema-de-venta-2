// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Section.css';

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
        estado: true,
        fechaRegistro: '' // Nuevo campo para la fecha
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProveedorId, setEditingProveedorId] = useState(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/proveedores');
                setProveedores(response.data);
            } catch (err) {
                console.error('Error al cargar proveedores:', err);
            }
        };
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es 'estado', manejamos el valor como un booleano (true o false)
        setFormData({ 
            ...formData, 
            [name]: name === 'estado' ? value === '1' : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Si estamos editando, usamos PUT para actualizar
                await axios.put(`http://localhost:3001/api/proveedores/${editingProveedorId}`, formData);
                setIsEditing(false);
                setEditingProveedorId(null);
            } else {
                // Si estamos creando, usamos POST para insertar
                await axios.post('http://localhost:3001/api/proveedores', formData);
            }
            setShowForm(false);
            setFormData({ nombre: '', direccion: '', telefono: '', email: '', tipoProveedor: '', estado: true, fechaRegistro: '' });
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
            estado: !!proveedor.Estado,
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
        <div className="section-container-Usuario">
            <h1>Gestión de Proveedores</h1>
            <button className="add-button" onClick={() => setShowForm(!showForm)}>Agregar Proveedor</button>

            {showForm && (
                <div className="form-container">
                    <h2>{isEditing ? 'Editar Proveedor' : 'Registrar Proveedor'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                        <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
                        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
                        <input type="text" name="tipoProveedor" placeholder="Tipo de Proveedor" value={formData.tipoProveedor} onChange={handleChange} />
                        
                        {/* Campo de estado */}
                        <label>Estado:</label>
                        <select name="estado" value={formData.estado ? '1' : '0'} onChange={handleChange}>
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                        
                        <input type="date" name="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} /> {/* Campo de fecha */}
                        <button type="submit">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}

            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Tipo Proveedor</th>
                        <th>Estado</th>
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
                            <td>{proveedor.Estado ? 'Activo' : 'Inactivo'}</td>
                            <td>{new Date(proveedor.FechaRegistro).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(proveedor)}>Editar</button>
                                <button onClick={() => handleDelete(proveedor.idProveedor)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Proveedores;
