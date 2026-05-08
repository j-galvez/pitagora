import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas según autenticación y rol
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene permisos
 * @param {string} props.requiredRole - Rol requerido: 'admin' o 'cliente' (opcional)
 */
export function ProtectedRoute({ children, requiredRole }) {
  // Obtener usuario del localStorage
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  
  // Si no hay usuario logueado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && usuario.rol !== requiredRole) {
    // Redirigir según el rol del usuario
    const redirectTo = usuario.rol === 'admin' ? '/admin-dashboard' : '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }
  
  // Si todo está bien, renderizar el componente hijo
  return children;
}

