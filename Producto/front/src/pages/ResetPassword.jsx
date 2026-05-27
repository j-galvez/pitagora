import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const userId = usuario?.id_usuario || usuario?.idUsuario;

  useEffect(() => {
    if (!usuario || !usuario.resetPasswordRequired) {
      navigate('/login', { replace: true });
    }
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!newPassword || newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: userId,
          newPassword,
        }),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'No se pudo actualizar la contraseña');
      }

      localStorage.removeItem('usuario');
      sessionStorage.setItem('resetSuccessMessage', 'Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario || !usuario.resetPasswordRequired) {
    return null;
  }

  return (
    <section
      className="vh-100"
      style={{ background: 'linear-gradient(135deg, #003860 0%, #91ABC6 100%)' }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-6">
            <div
              className="card"
              style={{
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(0, 56, 96, 0.3)',
              }}
            >
              <div className="card-body p-4 p-lg-5">
                <h5
                  className="fw-normal mb-4 text-center"
                  style={{ color: '#003860' }}
                >
                  Restablecer contraseña
                </h5>

                {info && (
                  <div className="alert alert-success" role="alert">
                    {info}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="newPassword" style={{ color: '#003860' }}>
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control form-control-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="confirmPassword" style={{ color: '#003860' }}>
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control form-control-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-1 mb-4">
                    <button
                      className="btn btn-lg btn-block w-100"
                      type="submit"
                      style={{
                        backgroundColor: '#003860',
                        borderColor: '#003860',
                        color: 'white',
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link small"
                      style={{ color: '#91ABC6', textDecoration: 'none' }}
                      onClick={() => navigate('/login')}
                    >
                      Volver al login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
