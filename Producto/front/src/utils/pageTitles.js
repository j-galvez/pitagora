const APP_NAME = 'Pitagora';

const ROUTE_TITLES = [
  { path: '/admin-dashboard', title: 'Panel de administración' },
  { path: '/admin/reportes', title: 'Reportes' },
  { path: '/admin/buscar', title: 'Búsqueda' },
  { path: '/admin/tickets', title: 'Gestión de tickets' },
  { path: '/admin/clientes', title: 'Clientes' },
  { path: '/admin/obras', title: 'Obras' },
  { path: '/admin/crear-cliente', title: 'Crear cliente' },
  { path: '/crear-cliente', title: 'Crear cliente' },
  { path: '/admin/crear-obra', title: 'Crear obra' },
  { path: '/admin/usuarios', title: 'Usuarios' },
  { path: '/admin/crear-usuarios', title: 'Crear usuario' },
  { path: '/perfil-admin', title: 'Mi perfil' },
  { path: '/dashboard', title: 'Mis solicitudes' },
  { path: '/perfil', title: 'Mi perfil' },
  { path: '/crear-ticket', title: 'Crear ticket' },
  { path: '/crear-observacion', title: 'Crear observación' },
  { path: '/mensajes/detalle', title: 'Detalle de mensajes' },
  { path: '/mensajes', title: 'Mensajes' },
  { path: '/reset-password', title: 'Restablecer contraseña' },
  { path: '/formulario-test', title: 'Formulario de prueba' },
  { path: '/login', title: 'Iniciar sesión' },
  { path: '/', title: 'Iniciar sesión' },
];

const DYNAMIC_ROUTE_TITLES = [
  { pattern: /^\/admin\/clientes\/\d+$/, title: 'Editar cliente' },
  { pattern: /^\/admin\/obras\/\d+$/, title: 'Editar obra' },
  { pattern: /^\/admin\/usuarios\/\d+$/, title: 'Editar usuario' },
  { pattern: /^\/crear-observacion\/\d+$/, title: 'Crear observación' },
];

export function getPageTitle(pathname) {
  const exactMatch = ROUTE_TITLES.find(({ path }) => path === pathname);
  if (exactMatch) return exactMatch.title;

  const dynamicMatch = DYNAMIC_ROUTE_TITLES.find(({ pattern }) => pattern.test(pathname));
  if (dynamicMatch) return dynamicMatch.title;

  return 'Página no encontrada';
}

export function formatDocumentTitle(pageTitle) {
  return `${pageTitle} | ${APP_NAME}`;
}
