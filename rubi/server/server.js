// server.js
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware para permitir solicitudes de otros dominios y recibir datos JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'matute',
  database: 'SistemaVentas'
});

// Conecta a MySQL y verifica si hay errores
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Ruta para obtener la lista de proveedores
app.get('/api/proveedores', (req, res) => {
  const query = 'SELECT * FROM PROVEEDOR';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).json({ message: 'Error al obtener proveedores' });
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo proveedor
app.post('/api/proveedores', (req, res) => {
  const { nombre, direccion, telefono, email, tipoProveedor, estado } = req.body;
  
  const query = `
    INSERT INTO PROVEEDOR (Nombre, Direccion, Telefono, Email, TipoProveedor, Estado, FechaRegistro) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  
  db.query(query, [nombre, direccion, telefono, email, tipoProveedor, estado ? 1 : 0], (err) => {
    if (err) {
      console.error('Error al crear proveedor:', err);
      return res.status(500).json({ message: 'Error al crear proveedor', error: err });
    }
    res.status(201).json({ message: 'Proveedor creado exitosamente' });
  });
});

// Ruta para actualizar un proveedor
app.put('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email, tipoProveedor, estado } = req.body;

  const query = `
    UPDATE PROVEEDOR 
    SET Nombre = ?, Direccion = ?, Telefono = ?, Email = ?, TipoProveedor = ?, Estado = ? 
    WHERE idProveedor = ?
  `;
  
  db.query(query, [nombre, direccion, telefono, email, tipoProveedor, estado ? 1 : 0, id], (err) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).json({ message: 'Error al actualizar proveedor', error: err });
    }
    res.json({ message: 'Proveedor actualizado exitosamente' });
  });
});

// Ruta para eliminar un proveedor
app.delete('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM PROVEEDOR WHERE idProveedor = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).json({ message: 'Error al eliminar proveedor' });
    }
    res.json({ message: 'Proveedor eliminado exitosamente' });
  });
});

// Iniciar el servidor en el puerto 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
