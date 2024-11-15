// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sucursales.css';

function Sucursales() {
    const [sucursales, setSucursales] = useState([]);
    const [sucursalActual, setSucursalActual] = useState({ nombre: '', direccion: '', telefono: '' });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    useEffect(() => {
        obtenerSucursales();
    }, []);

    // Obtener la lista de sucursales
    const obtenerSucursales = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3001/api/sucursales');
            setSucursales(respuesta.data);
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
        }
    };

    // Manejar el envío del formulario (agregar o editar según el caso)
    const manejarEnvioFormulario = async () => {
        try {
            if (modoEdicion) {
                await axios.put(`http://localhost:3001/api/sucursales/${sucursalActual.idSucursal}`, sucursalActual);
            } else {
                await axios.post('http://localhost:3001/api/sucursales', sucursalActual);
            }
            obtenerSucursales();
            cancelarFormulario();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    // Manejar el inicio de la edición de una sucursal
    const manejarEdicion = (sucursal) => {
        setSucursalActual(sucursal);
        setModoEdicion(true);
        setMostrarFormulario(true);
    };

    // Restablecer el formulario y salir del modo edición
    const cancelarFormulario = () => {
        setSucursalActual({ nombre: '', direccion: '', telefono: '' });
        setModoEdicion(false);
        setMostrarFormulario(false);
    };

    // Eliminar una sucursal
    const eliminarSucursal = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/sucursales/${id}`);
            obtenerSucursales();
        } catch (error) {
            console.error('Error al eliminar sucursal:', error);
        }
    };

    // Filtrar sucursales por término de búsqueda
    const sucursalesFiltradas = sucursales.filter(sucursal =>
        sucursal.Nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        sucursal.Direccion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        sucursal.Telefono.includes(terminoBusqueda)
    );

    return (
        <div className="sucursales-section-container">
            <div className="sucursales-header-container">
                <h1>Gestión de Sucursales</h1>

                <div className="sucursales-header-actions">
                    <input
                        className="sucursales-search-input"
                        type="text"
                        placeholder="Buscar sucursal..."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Mover el botón directamente debajo del título */}
            <div className="sucursales-add-button-container">
                <button
                    className="sucursales-toggle-form-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    Agregar Sucursal
                </button>
            </div>

            {mostrarFormulario && (
                <div className="sucursales-form-container">
                    <h2>{modoEdicion ? 'Editar Sucursal' : 'Agregar Sucursal'}</h2>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={sucursalActual.nombre}
                        onChange={(e) => setSucursalActual({ ...sucursalActual, nombre: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Dirección"
                        value={sucursalActual.direccion}
                        onChange={(e) => setSucursalActual({ ...sucursalActual, direccion: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Teléfono"
                        value={sucursalActual.telefono}
                        onChange={(e) => setSucursalActual({ ...sucursalActual, telefono: e.target.value })}
                    />
                    <div className="sucursales-form-actions">
                        <button className="sucursales-save-button" onClick={manejarEnvioFormulario}>
                            {modoEdicion ? 'Guardar' : 'Agregar'}
                        </button>
                        <button className="sucursales-cancel-button" onClick={cancelarFormulario}>Cancelar</button>
                    </div>
                </div>
            )}

            <h2>Lista de Sucursales</h2>
            <table border="1" className="sucursales-data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sucursalesFiltradas.map(sucursal => (
                        <tr key={sucursal.idSucursal}>
                            <td>{sucursal.Nombre}</td>
                            <td>{sucursal.Direccion}</td>
                            <td>{sucursal.Telefono}</td>
                            <td>
                                <button className="sucursales-action-button" onClick={() => manejarEdicion(sucursal)}>
                                    Editar
                                </button>
                                <button
                                    className="sucursales-action-button"
                                    onClick={() => eliminarSucursal(sucursal.idSucursal)}
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

export default Sucursales;
