import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UsuarioForm from '../../components/UsuarioForm'; // El mismo componente visual de la foto
import AdminLayout from '../../components/AdminLayout'; // El layout morado de administración

const PerfilAdmin = () => {
  const navigate = useNavigate();

  // 1. Obtener el administrador logueado desde el localStorage
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  // Obtenemos el ID del propio administrador que está usando el sistema
  const id_usuario = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;

  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    direccionCalle: '',
    rol: '',
    idObra: '',
    idRegion: '',
    idComuna: '',
    estado: 'Activo'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 2. Cargar los datos del Administrador desde el Backend
  useEffect(() => {
    const fetchPerfil = async () => {
      if (!id_usuario) {
        setError('No se encontró la sesión del administrador.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar la información de tu perfil de administrador');
        }
        const data = await response.json();
        setUsuario(data);
        setFormData({
          nombre: data.nombre || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          direccionCalle: data.direccionCalle || '',
          rol: data.rol || 'admin',
          idObra: data.idObra != null ? data.idObra : '',
          idRegion: data.idRegion != null ? data.idRegion : '',
          idComuna: data.idComuna != null ? data.idComuna : '',
          estado: data.estado || 'Activo'
        });
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    console.log('PerfilAdmin cargado para el administrador con ID:', id_usuario);
    fetchPerfil();
  }, [id_usuario]);

  // 3. Guardar CAMPO POR CAMPO (Haciendo clic en el lápiz y luego en Guardar)
  const handleFieldSave = async (name, value) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const payload = { [name]: value };
      const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al guardar el campo');
      }

      const updatedUsuario = await response.json();
      setUsuario(updatedUsuario);
      setFormData((prev) => ({ ...prev, [name]: value }));
      setSuccessMsg('Campo actualizado correctamente.');

      // Si el administrador cambia su nombre, lo actualizamos arriba en el saludo del Layout
      if (name === 'nombre') {
        const nuevoStorage = { ...usuarioLogueado, nombre: value };
        localStorage.setItem('usuario', JSON.stringify(nuevoStorage));
      }

    } catch (err) {
      setError(err.message || 'Error al guardar el campo');
    } finally {
      setLoading(false);
    }
  };

  // 4. Si el formulario procesa el guardado completo al hacer Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el perfil');
      }

      setSuccessMsg('¡Perfil actualizado con éxito!');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard'); // Si cancela, vuelve al panel del administrador
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Mi Perfil de Administrador" 
      handleVolver={handleVolver}
    >
      {loading && !usuario ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="mt-3">Cargando tus datos de administrador...</div>
        </div>
      ) : (
        <>
          <div className="container mt-4">
            <div className="row">
              <div className="col-12">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {successMsg && <div className="alert alert-success" role="alert">{successMsg}</div>}
              </div>
            </div>
          </div>

          <UsuarioForm
            usuario={usuario}
            formData={formData}
            loading={loading}
            error={error}
            onFieldSave={handleFieldSave}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default PerfilAdmin;