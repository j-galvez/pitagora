import { Routes, Route } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // npm install bootstrap-icons // npm install react-icons --save
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/login';
import IndexAdmin from './pages/admin/IndexAdmin';
import IndexUsuario from './pages/cliente/IndexUsuario';
import CrearTicket from './pages/cliente/CrearTicket';
import CrearObservacion from './pages/cliente/CrearObservacion';
import Formulario from './pages/tests/formulario';
import PerfilCliente from './pages/cliente/PerfilCliente';
import PerfilAdmin from './pages/admin/PerfilAdmin';
import GestionUsuario from './pages/admin/GestionUsuario';
import CrearUsuario from './pages/admin/CrearUsuario';
import EditarUsuario from './pages/admin/EditarUsuario';
import CrearCliente from './pages/admin/CrearCliente';
import CrearObra from './pages/admin/CrearObra';
import GestionTickets from './pages/admin/GestionTickets';
import ListaObras from './pages/admin/ListaObras';
import ListaClientes from './pages/admin/ListaClientes';
import ReporteBitacoraObra from './pages/admin/ReporteBitacoraObra';
import ResultadosBusqueda from './pages/admin/ResultadosBusqueda';
import ResetPassword from './pages/ResetPassword';
import MisMensajes from './pages/MisMensajes';
import DetalleCorreosGrupo from './pages/DetalleCorreosGrupo';
import EditarCliente from './pages/admin/EditarCliente';
import EditarObra from './pages/admin/EditarObra';


function App() {
  return (
    <>
    <PageTitle />
    <Routes>
      {/* Rutas de Administrador */}
      <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><IndexAdmin /></ProtectedRoute>} />
      <Route path="/admin/reportes" element={<ProtectedRoute requiredRole="admin"><ReporteBitacoraObra /></ProtectedRoute>} />
      <Route path="/admin/buscar" element={<ProtectedRoute requiredRole="admin"><ResultadosBusqueda /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute requiredRole="admin"><GestionTickets /></ProtectedRoute>} />
      <Route path="/admin/clientes" element={<ProtectedRoute requiredRole="admin"><ListaClientes /></ProtectedRoute>} />
      <Route path="/admin/obras" element={<ProtectedRoute requiredRole="admin"><ListaObras /></ProtectedRoute>} />
      <Route path="/admin/crear-cliente" element={<ProtectedRoute requiredRole="admin"><CrearCliente /></ProtectedRoute>} />
      <Route path="/crear-cliente" element={<ProtectedRoute requiredRole="admin"><CrearCliente /></ProtectedRoute>} />
      <Route path="/admin/clientes/:id_cliente" element={<ProtectedRoute requiredRole="admin"><EditarCliente /></ProtectedRoute>} />
      <Route path="/admin/crear-obra" element={<ProtectedRoute requiredRole="admin"><CrearObra /></ProtectedRoute>} />
      <Route path="/admin/obras/:id_obra" element={<ProtectedRoute requiredRole="admin"><EditarObra /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute requiredRole="admin"><GestionUsuario /></ProtectedRoute>} />
      <Route path="/admin/crear-usuarios" element={<ProtectedRoute requiredRole="admin"><CrearUsuario /></ProtectedRoute>} />
      <Route path="/admin/usuarios/:id_usuario" element={<ProtectedRoute requiredRole="admin"><EditarUsuario /></ProtectedRoute>} />
      <Route path="/perfil-admin" element={<ProtectedRoute requiredRole="admin"><PerfilAdmin /></ProtectedRoute>} />

      {/* Rutas de Cliente */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="usuario"><IndexUsuario /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute requiredRole="usuario"><PerfilCliente /></ProtectedRoute>} />
      
      {/* Rutas compartidas */}
      <Route path="/crear-ticket" element={<ProtectedRoute><CrearTicket /></ProtectedRoute>} />
      <Route path="/crear-observacion" element={<ProtectedRoute><CrearObservacion /></ProtectedRoute>} />
      <Route path="/crear-observacion/:id_ticket" element={<ProtectedRoute><CrearObservacion /></ProtectedRoute>} />
      <Route path="/mensajes" element={<ProtectedRoute><MisMensajes /></ProtectedRoute>} />
      <Route path="/mensajes/detalle" element={<ProtectedRoute><DetalleCorreosGrupo /></ProtectedRoute>} />

      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
    </>
  );
}

export default App;

// Made with Bob
