import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CambiarPasswordSection from '../components/CambiarPasswordSection';

export default function ResetPassword() {
  const navigate = useNavigate();

  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const userId = usuario?.id_usuario || usuario?.idUsuario;

  useEffect(() => {
    if (!usuario || !usuario.resetPasswordRequired) {
      navigate('/login', { replace: true });
    }
  }, [usuario, navigate]);

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

                <CambiarPasswordSection
                  idUsuario={userId}
                  logoutOnSuccess
                  defaultExpanded
                  showToggleButton={false}
                />

                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link small"
                    style={{ color: '#91ABC6', textDecoration: 'none' }}
                    onClick={() => navigate('/login')}
                  >
                    Volver al login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
