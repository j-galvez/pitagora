import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // npm install bootstrap-icons // npm install react-icons --save
import Login from './pages/login';
import IndexAdmin from './pages/admin/IndexAdmin';
import IndexUsuario from './pages/cliente/IndexUsuario';
import GestionUsuario from './components/GestionUsuario';
import CrearUsuario from './components/CrearUsuario';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<IndexAdmin />} />
      <Route path="/dashboard" element={<IndexUsuario />} />
      <Route path="/admin/usuarios" element={<GestionUsuario />} />
      <Route path="/admin/crear-usuarios" element={<CrearUsuario />} />
    </Routes>
  );
}

export default App;