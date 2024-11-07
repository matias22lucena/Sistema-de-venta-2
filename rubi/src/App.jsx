// Importaciones necesarias de React y react-router-dom
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Formulario } from './componentes/Formulario';
import { Home } from './componentes/Home';
import Usuarios from './componentes/Usuarios'; // Import correcto
import Proveedores from './componentes/Proveedores';

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para el usuario, inicializado desde localStorage si existe
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // useEffect para actualizar localStorage cada vez que el usuario cambia
  useEffect(() => {
    if (user) {
      // Guarda el usuario en localStorage si está autenticado
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Remueve el usuario de localStorage al cerrar sesión
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal: muestra el formulario si el usuario no está logueado, o Home si sí */}
          <Route path="/" element={!user ? <Formulario setUser={setUser} /> : <Home user={user} setUser={setUser} />} />
          {/* Ruta para el componente de gestión de usuarios */}
          <Route path="/usuarios" element={<Usuarios />} />
          {/* Ruta para el componente Home */}
          <Route path="/home" element={<Home user={user} setUser={setUser} />} />
          <Route path="/proveedores" element={<Proveedores />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;