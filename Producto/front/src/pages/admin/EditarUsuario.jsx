import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import UsuarioForm from '../../components/UsuarioForm';
import AdminLayout from '../../components/AdminLayout';

const EditarUsuario = () => {
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };
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

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`);
        if (!response.ok) {
          throw new Error('No se encontró el usuario');
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
          rol: data.rol || '',
          idObra: data.idObra != null ? data.idObra : '',
          idRegion: data.idRegion != null ? data.idRegion : '',
          idComuna: data.idComuna != null ? data.idComuna : '',
          estado: data.estado || 'Activo'
        });
      } catch (err) {
        setError(err.message || 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    console.log('EditarUsuario cargado con id_usuario:', id_usuario);
    fetchUsuario();
  }, [id_usuario]);

  const handleFieldSave = async (name, value) => {
    setLoading(true);
    setError('');
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
    } catch (err) {
      setError(err.message || 'Error al guardar el campo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          correo: formData.correo,
          telefono: formData.telefono,
          direccionCalle: formData.direccionCalle,
          rol: formData.rol,
          idObra: formData.idObra || null,
          idRegion: formData.idRegion || null,
          idComuna: formData.idComuna || null,
          estado: formData.estado,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el usuario');
      }

      navigate('/admin/usuarios');
    } catch (err) {
      setError(err.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  const handleVolver = () => {
    console.log('Volver a la lista de usuarios');
    navigate('/admin/usuarios');
  };

  if (loading) {
    return (
      <div className="d-flex">
        <NavbarAdmin />
        <div className="flex-grow-1 container mt-4 py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="mt-3">Cargando usuario...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="d-flex">
        <NavbarAdmin />
        <div className="flex-grow-1 container mt-4">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning" role="alert">
                No se encontró el usuario. Revisa el ID o vuelve a la lista de usuarios.
              </div>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Volver a usuarios
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Editar Usuario" 
      handleVolver={handleVolver}
    >
        <div className="container mt-4">
          <div className="row">
            <div className="col-12">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
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
    </AdminLayout>
  );
};

export default EditarUsuario;