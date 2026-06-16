import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';

const API_URL = 'http://localhost:8080/api/usuarios/reset-password';

const CambiarPasswordSection = ({
  idUsuario,
  disabled = false,
  logoutOnSuccess = false,
  defaultExpanded = false,
  showToggleButton = true,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleCancel = () => {
    resetFields();
    setExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idUsuario) {
      setError('No se pudo identificar al usuario.');
      return;
    }

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario, newPassword }),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'No se pudo actualizar la contraseña');
      }

      if (logoutOnSuccess) {
        localStorage.removeItem('usuario');
        sessionStorage.setItem(
          'resetSuccessMessage',
          'Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.'
        );
        navigate('/login', { replace: true });
        return;
      }

      setSuccess('Contraseña actualizada correctamente.');
      resetFields();
      setExpanded(false);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (showToggleButton && !expanded) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setExpanded(true)}
          disabled={disabled}
        >
          <FaKey className="me-2" />
          Cambiar contraseña
        </button>
        {disabled && (
          <small className="d-block text-muted mt-2">
            No se puede cambiar la contraseña de un usuario inactivo.
          </small>
        )}
      </div>
    );
  }

  return (
    <div>
      {success && (
        <div className="alert alert-success py-2" role="alert" style={{ fontSize: '13px' }}>
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '13px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          {showToggleButton && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm px-3"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambiarPasswordSection;
