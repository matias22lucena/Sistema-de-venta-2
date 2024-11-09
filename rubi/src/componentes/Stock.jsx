// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Stock() {
    const [productos, setProductos] = useState([]);
    const [sucursales, setSucursales] = useState([]); // Nuevo estado para las sucursales
    const [formData, setFormData] = useState({
        producto: '',
        precioCompra: '',
        precioVenta: '',
        idSucursal: '',
        cantidad: '',
        fechaRegistro: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);

    // Obtener el stock de productos y las sucursales al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/stock');
                setProductos(response.data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            }
        };

        const fetchSucursales = async () => { // Nueva función para obtener sucursales
            try {
                const response = await axios.get('http://localhost:3001/api/sucursales');
                setSucursales(response.data);
            } catch (err) {
                console.error('Error al cargar sucursales:', err);
            }
        };

        fetchProductos();
        fetchSucursales(); // Llamar a fetchSucursales para llenar el select
    }, []);

    // Manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el campo es precioCompra o precioVenta, añade el símbolo $
        const formattedValue = (name === 'precioCompra' || name === 'precioVenta') && !value.startsWith('$')
            ? `$${value}`
            : value;

        setFormData({
            ...formData,
            [name]: formattedValue
        });
    };

    // Enviar el formulario para registrar un nuevo producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/stock', formData);
            setShowForm(false);
            setFormData({ producto: '', precioCompra: '', precioVenta: '', idSucursal: '', cantidad: '', fechaRegistro: '' });
            setError(null);

            // Refrescar la lista de productos
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
            <button className="add-button" onClick={() => setShowForm(!showForm)}>Agregar Producto</button>

            {showForm && (
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
                            type="text" // Cambiado a texto para mostrar $
                            name="precioCompra"
                            placeholder="Precio de Compra"
                            value={formData.precioCompra}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text" // Cambiado a texto para mostrar $
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
                            <td>{producto.idSucursal}</td>
                            <td>{producto.Cantidad}</td>
                            <td>{producto.FechaRegistro}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Stock;

