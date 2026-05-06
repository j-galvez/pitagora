import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // npm install bootstrap-icons // npm install react-icons --save
import Login from './pages/login';
import IndexAdmin from './pages/admin/IndexAdmin';
import IndexUsuario from './pages/cliente/IndexUsuario';
import Formulario from './pages/tests/formulario';
import GestionUsuario from './pages/admin/GestionUsuario';
import CrearUsuario from './pages/admin/CrearUsuario';
import EditarUsuario from './pages/admin/EditarUsuario';
import CrearCliente from './pages/admin/CrearCliente';
import CrearObra from './pages/admin/CrearObra';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<IndexAdmin />} />
      <Route path="/dashboard" element={<IndexUsuario />} />
      <Route path="/formulario-test" element={<Formulario />} />

      <Route path="/admin/crear-cliente" element={<CrearCliente />} />
      <Route path="/admin/crear-obra" element={<CrearObra />} />
      <Route path="/admin/usuarios" element={<GestionUsuario />} />
      <Route path="/admin/crear-usuarios" element={<CrearUsuario />} />
      <Route path="/admin/usuarios/:id_usuario" element={<EditarUsuario />} />
      <Route
        path="*"
        element={
          <div className="container py-5">
            <h2>Ruta no encontrada</h2>
            <p>Verifica la URL o regresa a <a href="/admin/usuarios">Gestión de Usuarios</a>.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;