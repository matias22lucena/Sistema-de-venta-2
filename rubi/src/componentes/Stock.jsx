// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Stock() {
    const [stock, setStock] = useState([]);
    const [newProduct, setNewProduct] = useState({ idProducto: '', idSucursal: '', Cantidad: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStock();
    }, []);

    // Obtener el stock
    const fetchStock = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/stock');
            setStock(response.data);
        } catch (error) {
            console.error('Error al obtener el stock:', error);
        }
    };

    // Agregar producto
    const addProduct = async () => {
        try {
            await axios.post('http://localhost:3001/api/stock', newProduct);
            fetchStock();
            setNewProduct({ idProducto: '', idSucursal: '', Cantidad: '' });
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/stock/${id}`);
            fetchStock();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    // Filtrar productos por término de búsqueda
    const filteredStock = stock.filter(item =>
        item.idProducto.toString().includes(searchTerm) ||
        item.idSucursal.toString().includes(searchTerm) ||
        item.Cantidad.toString().includes(searchTerm)
    );

    return (
        <div>
            <h1>Gestión de Stock</h1>

            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <h2>Agregar Producto</h2>
            <input
                type="text"
                placeholder="ID Producto"
                value={newProduct.idProducto}
                onChange={(e) => setNewProduct({ ...newProduct, idProducto: e.target.value })}
            />
            <input
                type="text"
                placeholder="ID Sucursal"
                value={newProduct.idSucursal}
                onChange={(e) => setNewProduct({ ...newProduct, idSucursal: e.target.value })}
            />
            <input
                type="number"
                placeholder="Cantidad"
                value={newProduct.Cantidad}
                onChange={(e) => setNewProduct({ ...newProduct, Cantidad: e.target.value })}
            />
            <button onClick={addProduct}>Agregar</button>

            <h2>Lista de Stock</h2>
            <ul>
                {filteredStock.map(item => (
                    <li key={item.idStock}>
                        ID Producto: {item.idProducto}, ID Sucursal: {item.idSucursal}, Cantidad: {item.Cantidad}
                        <button onClick={() => deleteProduct(item.idStock)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Stock;
