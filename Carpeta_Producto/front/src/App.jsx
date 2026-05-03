import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // npm install bootstrap-icons
import Login from './pages/login';
import IndexAdmin from './pages/admin/IndexAdmin';
import IndexUsuario from './pages/cliente/IndexUsuario';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<IndexAdmin />} />
      <Route path="/dashboard" element={<IndexUsuario />} />
    </Routes>
  );
}

export default App;