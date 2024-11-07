// src/pages/Usuarios.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Section.css';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el término de búsqueda
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        documento: '',
        nombreCompleto: '',
        correo: '',
        telefono: '',
        clave: '',
        idRol: ''
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/usuarios');
                setUsuarios(response.data);
            } catch (err) {
                console.error('Error al cargar usuarios:', err);
            }
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/usuarios/${editingUserId}`, formData);
                setIsEditing(false);
                setEditingUserId(null);
            } else {
                await axios.post('http://localhost:3001/api/usuarios', formData);
            }

            setShowForm(false);
            setFormData({ documento: '', nombreCompleto: '', correo: '', telefono: '', clave: '', idRol: '' });
            setError(null);

            const response = await axios.get('http://localhost:3001/api/usuarios');
            setUsuarios(response.data);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error al registrar o actualizar usuario');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
            setUsuarios(usuarios.filter((usuario) => usuario.idUsuario !== id));
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
        }
    };

    const handleEdit = (usuario) => {
        setFormData({
            documento: usuario.Documento,
            nombreCompleto: usuario.NombreCompleto,
            correo: usuario.Correo,
            telefono: usuario.Telefono,
            clave: usuario.Clave,
            idRol: usuario.idRol,
        });
        setShowForm(true);
        setIsEditing(true);
        setEditingUserId(usuario.idUsuario);
    };

    // Filtrar usuarios según el término de búsqueda
    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="section-container-Usuario">
            <nav className="navbar">
                <ul>
                    <li><a href="/home">Inicio</a></li>
                </ul>
            </nav>

            <h1>Gestión de Usuarios</h1>
            <button className="add-button" onClick={() => setShowForm(!showForm)}>Agregar Usuario</button>



            {showForm && (
                <div className="form-container">
                    <h2>{isEditing ? 'Editar Usuario' : 'Registrar Usuario'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="documento" placeholder="Documento" value={formData.documento} onChange={handleChange} required />
                        <input type="text" name="nombreCompleto" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleChange} required />
                        <input type="email" name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} />
                        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                        <input type="password" name="clave" placeholder="Contraseña" value={formData.clave} onChange={handleChange} required />
                        <select name="idRol" value={formData.idRol} onChange={handleChange} required>
                            <option value="">Seleccione un rol</option>
                            <option value="1">Admin</option>
                            <option value="2">Empleado</option>
                        </select>
                        <button type="submit">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
                {/* Campo de búsqueda */}
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
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
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
                            <td>{usuario.Rol}</td>
                            <td>
                                <button className="action-button" onClick={() => handleEdit(usuario)}>Editar</button>
                                <button className="action-button delete" onClick={() => handleDelete(usuario.idUsuario)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Usuarios;
