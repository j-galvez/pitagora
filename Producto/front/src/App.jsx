import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // npm install bootstrap-icons // npm install react-icons --save
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/login';
import IndexAdmin from './pages/admin/IndexAdmin';
import IndexUsuario from './pages/cliente/IndexUsuario';
import CrearTicket from './pages/cliente/CrearTicket';
import CrearObservacion from './pages/cliente/CrearObservacion';
import Formulario from './pages/tests/formulario';
import GestionUsuario from './pages/admin/GestionUsuario';
import CrearUsuario from './pages/admin/CrearUsuario';
import EditarUsuario from './pages/admin/EditarUsuario';
import CrearCliente from './pages/admin/CrearCliente';
import CrearObra from './pages/admin/CrearObra';
import GestionTickets from './pages/admin/GestionTickets';


function App() {
  return (
    <Routes>
      {/* Rutas de Administrador */}
      <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><IndexAdmin /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute requiredRole="admin"><GestionTickets /></ProtectedRoute>} />
      <Route path="/admin/crear-cliente" element={<ProtectedRoute requiredRole="admin"><CrearCliente /></ProtectedRoute>} />
      <Route path="/admin/crear-obra" element={<ProtectedRoute requiredRole="admin"><CrearObra /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute requiredRole="admin"><GestionUsuario /></ProtectedRoute>} />
      <Route path="/admin/crear-usuarios" element={<ProtectedRoute requiredRole="admin"><CrearUsuario /></ProtectedRoute>} />
      <Route path="/admin/usuarios/:id_usuario" element={<ProtectedRoute requiredRole="admin"><EditarUsuario /></ProtectedRoute>} />

      {/* Rutas de Cliente */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="usuario"><IndexUsuario /></ProtectedRoute>} />

      {/* Rutas compartidas */}
      <Route path="/crear-ticket" element={<ProtectedRoute><CrearTicket /></ProtectedRoute>} />
      <Route path="/crear-observacion" element={<ProtectedRoute><CrearObservacion /></ProtectedRoute>} />
      <Route path="/crear-observacion/:id_ticket" element={<ProtectedRoute><CrearObservacion /></ProtectedRoute>} />

      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/formulario-test" element={<Formulario />} />
      <Route
        path="*"
        element={
          <div className="container py-5">
            <h2>Ruta no encontrada</h2>
            <p>Verifica la URL o regresa a <a href="/login">Login</a>.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

// Made with Bob
