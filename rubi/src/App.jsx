import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Formulario } from './componentes/Formulario';
import { Home } from './componentes/home';
import Usuarios from './componentes/Usuarios';
import Proveedores from './componentes/Proveedores';
import Stock from './componentes/Stock';

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal: muestra el formulario si el usuario no está logueado, o Home si sí */}
          <Route path="/" element={!user ? <Formulario setUser={setUser} /> : <Home user={user} setUser={setUser} />} />

          {/* Rutas: Solo se accede si el usuario está autenticado */}
          <Route path="/home" element={<Home user={user} setUser={setUser} />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

