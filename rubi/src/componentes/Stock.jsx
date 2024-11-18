// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stock.css';

function Stock() {
    const [productos, setProductos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [formData, setFormData] = useState({
        producto: '',
        precioCompra: '',
        precioVenta: '',
        idSucursal: '',
        cantidad: '',
        fechaRegistro: ''
    });
    const [activeView, setActiveView] = useState(''); // Estado para controlar la vista activa
    const [error, setError] = useState(null);

    // Obtener datos de productos y sucursales al cargar
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/stock');
                setProductos(response.data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            }
        };

        const fetchSucursales = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/sucursales');
                setSucursales(response.data);
            } catch (err) {
                console.error('Error al cargar sucursales:', err);
            }
        };

        fetchProductos();
        fetchSucursales();
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = (name === 'precioCompra' || name === 'precioVenta') && !value.startsWith('$')
            ? `$${value}`
            : value;

        setFormData({
            ...formData,
            [name]: formattedValue
        });
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const precioCompraConvertido = parseFloat(formData.precioCompra.replace('$', '').replace(',', '.'));
        const precioVentaConvertido = parseFloat(formData.precioVenta.replace('$', '').replace(',', '.'));

        if (isNaN(precioCompraConvertido) || isNaN(precioVentaConvertido)) {
            setError('Precio de Compra o Precio de Venta no son valores válidos.');
            return;
        }

        const nuevoProducto = {
            ...formData,
            precioCompra: precioCompraConvertido,
            precioVenta: precioVentaConvertido
        };

        try {
            await axios.post('http://localhost:3001/api/stock', nuevoProducto);
            setActiveView(''); // Ocultar formulario tras el registro
            setFormData({ producto: '', precioCompra: '', precioVenta: '', idSucursal: '', cantidad: '', fechaRegistro: '' });
            setError(null);
            const response = await axios.get('http://localhost:3001/api/stock');
            setProductos(response.data);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error al registrar el producto');
        }
    };

    return (
        <div className="section-container-Stock">
            <h1>Gestión de Stock</h1>
            <div className="button-container">
                <button onClick={() => setActiveView('form')}>Agregar Producto</button>
                <button onClick={() => setActiveView('table')}>Ver Stock</button>
            </div>

            {activeView === 'form' && (
                <div className="form-container">
                    <h2>Registrar Producto</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="producto"
                            placeholder="Producto"
                            value={formData.producto}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="precioCompra"
                            placeholder="Precio de Compra"
                            value={formData.precioCompra}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="precioVenta"
                            placeholder="Precio de Venta"
                            value={formData.precioVenta}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="idSucursal"
                            value={formData.idSucursal}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una sucursal</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                                    {sucursal.Nombre}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="cantidad"
                            placeholder="Cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="fechaRegistro"
                            placeholder="Fecha de Registro"
                            value={formData.fechaRegistro}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Registrar</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}

            {activeView === 'table' && (
                <div className="table-container">
                    <h2>Lista de Productos</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Compra</th>
                                <th>Precio Venta</th>
                                <th>Sucursal</th>
                                <th>Cantidad</th>
                                <th>Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.idStock}>
                                    <td>{producto.Producto}</td>
                                    <td>{producto.PrecioCompra}</td>
                                    <td>{producto.PrecioVenta}</td>
                                    <td>{
                                        sucursales.find((sucursal) => sucursal.idSucursal === producto.idSucursal)?.Nombre
                                        || 'Sucursal no encontrada'
                                    }</td>
                                    <td>{producto.Cantidad}</td>
                                    <td>{new Date(producto.FechaRegistro).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Stock;

