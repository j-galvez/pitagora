import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UsuarioLayout from '../../components/UsuarioLayout';
import UsuarioForm from '../../components/UsuarioForm';

const PerfilCliente = () => {
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Cliente',
    rol: 'cliente'
  };

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

  // 2. Cargar los datos del Cliente desde el Backend al abrir la pestaña
  useEffect(() => {
    const fetchPerfil = async () => {
      if (!id_usuario) {
        setError('No se encontró un usuario autenticado en el sistema.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del perfil');
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
          rol: data.rol || 'cliente',
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

    console.log('PerfilCliente cargado para el usuario con ID:', id_usuario);
    fetchPerfil();
  }, [id_usuario]);

  // 3. Guardar CAMPO POR CAMPO (Esta es la magia de la imagen que me pasaste)
  // Cuando el usuario le dé clic a "Guardar" al lado del input de Teléfono, cambiará solo ese campo en el Back
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

      // Si el cliente cambió su nombre, lo actualizamos también en el localStorage para que el saludo cambie arriba
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

  // 4. Si el formulario tiene un botón "Guardar Todo" abajo del todo
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

      // Refrescar o redirigir al dashboard del cliente
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <UsuarioLayout usuario={usuarioLogueado} titulo="Mi Perfil">
      <div className="container p-4">
        {loading && !usuario ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="mt-3">Cargando tus datos de perfil...</div>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-12">
                <p className="text-muted mb-4">Modifica tus datos de contacto y revisa tu información personal</p>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
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
      </div>
    </UsuarioLayout>
  );
};

export default PerfilCliente;