// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Usuarios from './Usuarios'; // Importamos el componente Usuarios
import Proveedores from './Proveedores';
import Stock from './Stock'
import Sucursales from './Sucursales';
import './Home.css';

export function Home({ user, setUser }) {
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('usuarios'); // Estado para seleccionar el panel activo

    // Función para manejar el logout
    const handleLogout = () => {
        setUser(null); // Limpia el estado del usuario
        navigate('/'); // Redirige a la página de inicio de sesión
    };

    return (
        <div className="container">
            <div className="welcome-message">
                Bienvenido, {user.name}
            </div>

            <div className="sidebar">
                <h2>Panel de Navegación</h2>
                <button className="menu-button" onClick={() => setActiveComponent('usuarios')}>Usuarios</button>
                <button className="menu-button" onClick={() => setActiveComponent('proveedores')}>Proveedores</button>
                <button className="menu-button" onClick={() => setActiveComponent('sucursales')}>Sucursales</button>
                <button className="menu-button" onClick={() => setActiveComponent('productos')}>Productos</button>
                <button className="menu-button" onClick={() => setActiveComponent('ventas')}>Ventas</button>
                {user.role === 'admin' && (
                    <>
                        <button className="menu-button" onClick={() => setActiveComponent('stock')}>Stock</button>
                        <button className="menu-button" onClick={() => setActiveComponent('reportes')}>Reportes</button>
                    </>
                )}
                <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
            </div>

            <div className="main-content">
                {/* Renderiza el componente según el panel activo */}
                {activeComponent === 'usuarios' && <Usuarios />}
                {activeComponent === 'proveedores' && <Proveedores />}
                {activeComponent === 'stock' && <Stock />}
                {activeComponent === 'sucursales' && <Sucursales/>}
                {/* Aquí se pueden agregar otros componentes como <Proveedores />, <Sucursales />, etc. */}
            </div>
        </div>
    );
}

Home.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
    setUser: PropTypes.func.isRequired,
};

