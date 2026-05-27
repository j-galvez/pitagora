# 📱 Documentación del Frontend - Sistema Pitagora

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Tecnologías y Librerías](#tecnologías-y-librerías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura](#arquitectura)
5. [Componentes Principales](#componentes-principales)
6. [Sistema de Rutas](#sistema-de-rutas)
7. [Servicios API](#servicios-api)
8. [Flujo de Autenticación](#flujo-de-autenticación)
9. [Estilos y Diseño](#estilos-y-diseño)
10. [Configuración](#configuración)

---

## 🎯 Descripción General

El frontend de Pitagora es una **Single Page Application (SPA)** desarrollada con React que gestiona el sistema de postventa de una constructora. Permite a administradores y clientes gestionar tickets, observaciones, obras y usuarios.

### Características Principales:
- ✅ Sistema de autenticación con roles (Admin/Cliente)
- ✅ Dashboard con KPIs y estadísticas en tiempo real
- ✅ Gestión completa de tickets y observaciones
- ✅ Interfaz responsive (móvil y desktop)
- ✅ Protección de rutas por rol
- ✅ Integración con API REST backend

---

## 🛠️ Tecnologías y Librerías

### Core
- **React 19.2.4** - Librería principal para construir la UI
- **React DOM 19.2.4** - Renderizado de componentes React
- **Vite 8.0.4** - Build tool y dev server (reemplazo moderno de Webpack)

### Routing
- **React Router DOM 7.14.1** - Navegación y gestión de rutas SPA

### UI/Estilos
- **Bootstrap 5.3.8** - Framework CSS para diseño responsive
- **React Bootstrap 2.10.10** - Componentes Bootstrap para React
- **Bootstrap Icons 1.13.1** - Iconografía oficial de Bootstrap
- **React Icons 5.6.0** - Librería adicional de iconos (Font Awesome, etc.)

### Desarrollo
- **ESLint 9.39.4** - Linter para mantener código limpio
- **@vitejs/plugin-react 6.0.1** - Plugin de Vite para React
- **TypeScript Types** - Tipos para React (desarrollo)

### Características de Vite:
- ⚡ Hot Module Replacement (HMR) ultra rápido
- 📦 Build optimizado con Rollup
- 🔧 Configuración mínima
- 🚀 Inicio instantáneo del servidor de desarrollo

---

## 📁 Estructura del Proyecto

```
front/
├── public/                      # Archivos estáticos
│   ├── favicon.svg
│   └── icons.svg
│
├── src/                         # Código fuente
│   ├── assets/                  # Recursos (imágenes, etc.)
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── AdminLayout.jsx      # Layout principal admin
│   │   ├── CardObservacion.jsx  # Tarjeta de observación
│   │   ├── CardTicket.jsx       # Tarjeta de ticket
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── NavbarAdmin.jsx      # Navegación admin
│   │   ├── NavbarUsuario.jsx    # Navegación cliente
│   │   ├── ProtectedRoute.jsx   # HOC protección rutas
│   │   ├── UsuarioForm.jsx      # Formulario usuario
│   │   └── dashboard/           # Componentes dashboard
│   │       ├── KPICard.jsx      # Tarjeta KPI
│   │       └── TopFallasChart.jsx # Gráfico fallas
│   │
│   ├── pages/                   # Páginas/Vistas
│   │   ├── login.jsx            # Página login
│   │   ├── admin/               # Páginas admin
│   │   │   ├── IndexAdmin.jsx
│   │   │   ├── GestionTickets.jsx
│   │   │   ├── GestionUsuario.jsx
│   │   │   ├── CrearUsuario.jsx
│   │   │   ├── EditarUsuario.jsx
│   │   │   ├── CrearCliente.jsx
│   │   │   ├── CrearObra.jsx
│   │   │   ├── DetalleTicket.jsx
│   │   │   └── ListaTickets.jsx
│   │   ├── cliente/             # Páginas cliente
│   │   │   ├── IndexUsuario.jsx
│   │   │   ├── CrearTicket.jsx
│   │   │   └── CrearObservacion.jsx
│   │   └── tests/               # Páginas de prueba
│   │       └── formulario.jsx
│   │
│   ├── services/                # Servicios API
│   │   ├── dashboardService.js
│   │   ├── ticketsService.js
│   │   └── observacionesService.js
│   │
│   ├── App.jsx                  # Componente raíz
│   ├── App.css                  # Estilos App
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
│
├── index.html                   # HTML base
├── package.json                 # Dependencias
├── vite.config.js              # Configuración Vite
├── eslint.config.js            # Configuración ESLint
├── PROTECCION_RUTAS.md         # Doc protección rutas
└── README.md                    # Readme básico
```

---

## 🏗️ Arquitectura

### Patrón de Diseño: Component-Based Architecture

```
┌─────────────────────────────────────────┐
│           main.jsx (Entry)              │
│  - StrictMode                           │
│  - BrowserRouter                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            App.jsx (Root)               │
│  - Define todas las rutas               │
│  - Gestiona navegación                  │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│   Public    │  │  Protected  │
│   Routes    │  │   Routes    │
└─────────────┘  └──────┬──────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       ┌─────────────┐     ┌─────────────┐
       │    Admin    │     │   Cliente   │
       │    Pages    │     │    Pages    │
       └─────────────┘     └─────────────┘
```

### Flujo de Datos

```
Component → Service → API Backend → Database
    ↑                                    │
    └────────────────────────────────────┘
         (Response con datos)
```

---

## 🧩 Componentes Principales

### 1. **ProtectedRoute** (HOC - Higher Order Component)
**Ubicación:** `src/components/ProtectedRoute.jsx`

**Propósito:** Proteger rutas según autenticación y rol del usuario.

**Funcionamiento:**
```javascript
<ProtectedRoute requiredRole="admin">
  <ComponenteProtegido />
</ProtectedRoute>
```

**Lógica:**
1. Verifica si existe usuario en `localStorage`
2. Si no hay usuario → Redirige a `/login`
3. Si hay `requiredRole` y no coincide → Redirige al dashboard correspondiente
4. Si todo OK → Renderiza el componente hijo

### 2. **AdminLayout**
**Ubicación:** `src/components/AdminLayout.jsx`

**Propósito:** Layout wrapper para todas las páginas de administrador.

**Características:**
- Sidebar fijo con navegación (desktop)
- Offcanvas menu (móvil)
- Barra superior con título dinámico
- Botón "Volver" opcional
- Área de contenido principal

**Uso:**
```jsx
<AdminLayout 
  usuario={usuarioLogueado} 
  titulo="Dashboard Administrador"
  handleVolver={() => navigate(-1)}
>
  {/* Contenido de la página */}
</AdminLayout>
```

### 3. **NavbarAdmin**
**Ubicación:** `src/components/NavbarAdmin.jsx`

**Propósito:** Menú de navegación lateral para administradores.

**Opciones del menú:**
- 📊 Dashboard
- 📝 Tickets
- ➕ Crear Nuevo Ticket
- 🔍 Crear Observación
- 🏢 Crear Cliente
- 🏗️ Crear Obra
- 👥 Gestión de Usuarios
- ➕ Creación de Usuarios
- 💬 Mis Mensajes
- 🚪 Cerrar Sesión

**Características:**
- Resalta la opción activa según la ruta
- Responsive (sidebar fijo + offcanvas)
- Logo de Pitagora
- Información del usuario logueado

### 4. **KPICard**
**Ubicación:** `src/components/dashboard/KPICard.jsx`

**Propósito:** Mostrar métricas clave en el dashboard.

**Props:**
- `titulo`: Nombre del KPI
- `valor`: Valor numérico
- `icono`: Componente de icono (React Icons)
- `color`: Color del tema (primary, info, success, danger)

### 5. **TopFallasChart**
**Ubicación:** `src/components/dashboard/TopFallasChart.jsx`

**Propósito:** Visualizar las 5 fallas más reportadas.

**Datos esperados:**
```javascript
[
  { nombreCategoria: "Eléctrico", cantidad: 15 },
  { nombreCategoria: "Plomería", cantidad: 12 },
  // ...
]
```

---

## 🛣️ Sistema de Rutas

### Configuración en App.jsx

```javascript
<Routes>
  {/* RUTAS PÚBLICAS */}
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  
  {/* RUTAS ADMIN (requiredRole="admin") */}
  <Route path="/admin-dashboard" element={
    <ProtectedRoute requiredRole="admin">
      <IndexAdmin />
    </ProtectedRoute>
  } />
  
  {/* RUTAS CLIENTE (requiredRole="usuario") */}
  <Route path="/dashboard" element={
    <ProtectedRoute requiredRole="usuario">
      <IndexUsuario />
    </ProtectedRoute>
  } />
  
  {/* RUTAS COMPARTIDAS (sin requiredRole) */}
  <Route path="/crear-ticket" element={
    <ProtectedRoute>
      <CrearTicket />
    </ProtectedRoute>
  } />
</Routes>
```

### Tabla de Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Página de login |
| `/login` | Público | Página de login |
| `/admin-dashboard` | Solo Admin | Dashboard administrador |
| `/admin/tickets` | Solo Admin | Gestión de tickets |
| `/admin/usuarios` | Solo Admin | Gestión de usuarios |
| `/admin/crear-usuarios` | Solo Admin | Crear nuevo usuario |
| `/admin/usuarios/:id` | Solo Admin | Editar usuario |
| `/admin/crear-cliente` | Solo Admin | Crear cliente |
| `/admin/crear-obra` | Solo Admin | Crear obra |
| `/dashboard` | Solo Cliente | Dashboard cliente |
| `/crear-ticket` | Autenticado | Crear ticket (ambos roles) |
| `/crear-observacion` | Autenticado | Crear observación |
| `/crear-observacion/:id_ticket` | Autenticado | Crear observación para ticket |

---

## 🔌 Servicios API

### Estructura de Servicios

Los servicios encapsulan las llamadas HTTP al backend.

### 1. **dashboardService.js**

```javascript
// Obtener estadísticas generales
obtenerEstadisticas() → {
  totalTickets: number,
  ticketsAbiertos: number,
  observacionesAbiertas: number,
  observacionesAltaUrgencia: number
}

// Obtener top 5 fallas
obtenerTopFallas() → [
  { nombreCategoria: string, cantidad: number }
]
```

### 2. **ticketsService.js**

```javascript
// CRUD completo de tickets
getAllTickets()           // GET /api/tickets
getTicketById(id)         // GET /api/tickets/:id
updateTicket(id, data)    // PUT /api/tickets/:id
deleteTicket(id)          // DELETE /api/tickets/:id
```

### 3. **observacionesService.js**

```javascript
// Gestión de observaciones
getAllObservaciones()
getObservacionById(id)
createObservacion(data)
updateObservacion(id, data)
deleteObservacion(id)
```

### Patrón de Uso

```javascript
// En un componente
import { obtenerEstadisticas } from '../../services/dashboardService';

const [stats, setStats] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const data = await obtenerEstadisticas();
      setStats(data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };
  
  cargarDatos();
}, []);
```

---

## 🔐 Flujo de Autenticación

### 1. Login (login.jsx)

```
Usuario ingresa credenciales
         ↓
POST /api/usuarios/login
         ↓
Backend valida credenciales
         ↓
Retorna datos del usuario + rol
         ↓
localStorage.setItem('usuario', JSON.stringify(data))
         ↓
Redirige según rol:
  - admin → /admin-dashboard
  - usuario → /dashboard
```

### 2. Verificación en ProtectedRoute

```
Usuario intenta acceder a ruta protegida
         ↓
ProtectedRoute lee localStorage
         ↓
¿Existe usuario?
  NO → Redirige a /login
  SÍ → ¿Coincide el rol requerido?
         NO → Redirige a su dashboard
         SÍ → Permite acceso
```

### 3. Estructura del Usuario en localStorage

```javascript
{
  "id_usuario": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "rol": "admin",  // o "usuario"
  "id_obra": 1     // solo para clientes
}
```

### 4. Cerrar Sesión

```javascript
const handleLogout = () => {
  localStorage.removeItem('usuario');
  navigate('/login');
};
```

---

## 🎨 Estilos y Diseño

### Paleta de Colores Pitagora

```css
/* Colores Corporativos */
--pitagora-azul-oscuro: #003860;   /* Principal */
--pitagora-azul-medio: #002840;    /* Sidebar */
--pitagora-azul-claro: #91ABC6;    /* Acentos */
--pitagora-rojo: #ED1C25;          /* Alertas/Botones */
--pitagora-gris: #F8F9FA;          /* Fondo */
```

### Sistema de Diseño

**Framework:** Bootstrap 5.3.8
- Grid system responsive (12 columnas)
- Componentes pre-diseñados
- Utilidades de espaciado y tipografía

**Breakpoints:**
```css
/* Mobile First */
xs: 0px      /* Extra small (móviles) */
sm: 576px    /* Small (móviles grandes) */
md: 768px    /* Medium (tablets) */
lg: 992px    /* Large (desktop) */
xl: 1200px   /* Extra large (desktop grande) */
```

### Componentes Bootstrap Usados

- **Cards** - Contenedores de contenido
- **Navbar** - Navegación superior
- **Offcanvas** - Menú lateral móvil
- **Forms** - Formularios
- **Buttons** - Botones
- **Alerts** - Mensajes de error/éxito
- **Badges** - Etiquetas de estado
- **Spinners** - Indicadores de carga

### Iconografía

**Bootstrap Icons:**
```html
<i className="bi bi-speedometer2"></i>  <!-- Dashboard -->
<i className="bi bi-file-text"></i>     <!-- Tickets -->
<i className="bi bi-person"></i>        <!-- Usuario -->
```

**React Icons (Font Awesome):**
```jsx
import { FaTicketAlt, FaChartBar } from 'react-icons/fa';
<FaTicketAlt className="me-2" />
```

---

## ⚙️ Configuración

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend URL
        changeOrigin: true,
      },
    },
  },
})
```

**Propósito del Proxy:**
- Evita problemas de CORS en desarrollo
- Redirige peticiones `/api/*` al backend
- Transparente para el código del frontend

### package.json - Scripts

```json
{
  "scripts": {
    "dev": "vite",              // Servidor desarrollo
    "build": "vite build",      // Build producción
    "lint": "eslint .",         // Linter
    "preview": "vite preview"   // Preview build
  }
}
```

### ESLint Configuration

```javascript
// eslint.config.js
export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]' 
      }],
    },
  },
])
```

---

## 🚀 Comandos de Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:5173
```

### Build Producción
```bash
npm run build
# Output en /dist
```

### Preview Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 📊 Flujo de Datos Completo

### Ejemplo: Cargar Dashboard Admin

```
1. Usuario accede a /admin-dashboard
         ↓
2. ProtectedRoute verifica autenticación y rol
         ↓
3. IndexAdmin.jsx se monta
         ↓
4. useEffect ejecuta cargarDatosDashboard()
         ↓
5. Llama a dashboardService.obtenerEstadisticas()
         ↓
6. Service hace fetch a http://localhost:8080/api/dashboard/stats
         ↓
7. Backend procesa y retorna JSON
         ↓
8. Service retorna datos al componente
         ↓
9. setStats(data) actualiza el estado
         ↓
10. React re-renderiza con los nuevos datos
         ↓
11. KPICards muestran las estadísticas
```

---

## 🔄 Ciclo de Vida de un Componente

### Ejemplo: IndexAdmin

```javascript
// 1. MONTAJE
useEffect(() => {
  cargarDatosDashboard();  // Se ejecuta al montar
}, []);

// 2. ACTUALIZACIÓN
const [stats, setStats] = useState({});  // Estado inicial
setStats(newData);  // Actualiza estado → Re-render

// 3. DESMONTAJE
useEffect(() => {
  return () => {
    // Cleanup si es necesario
  };
}, []);
```

---

## 🛡️ Seguridad

### Medidas Implementadas

1. **Protección de Rutas**
   - ProtectedRoute verifica autenticación
   - Validación de roles antes de renderizar

2. **Almacenamiento Local**
   - Usuario en localStorage (temporal)
   - ⚠️ **Recomendación:** Migrar a JWT tokens

3. **Validación Frontend**
   - Campos requeridos en formularios
   - Validación de tipos de datos

### Mejoras Recomendadas

```javascript
// TODO: Implementar
- JWT tokens en lugar de localStorage directo
- Refresh tokens para sesiones largas
- Timeout de sesión automático
- Encriptación de datos sensibles
- HTTPS en producción
```

---

## 📱 Responsive Design

### Estrategia Mobile-First

```jsx
{/* Sidebar: Oculto en móvil, visible en desktop */}
<div className="d-none d-lg-flex">
  <NavbarAdmin />
</div>

{/* Offcanvas: Visible en móvil, oculto en desktop */}
<div className="d-lg-none">
  <Offcanvas />
</div>
```

### Grid Responsive

```jsx
<div className="row">
  <div className="col-12 col-sm-6 col-lg-3">
    {/* 100% móvil, 50% tablet, 25% desktop */}
    <KPICard />
  </div>
</div>
```

---

## 🐛 Debugging

### React DevTools
- Inspeccionar componentes
- Ver props y state
- Profiler para performance

### Console Logs en Servicios
```javascript
catch (error) {
  console.error('Error en obtenerEstadisticas:', error);
  throw error;
}
```

### Network Tab
- Verificar llamadas API
- Inspeccionar request/response
- Validar headers y payloads

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)

### Archivos de Referencia
- `PROTECCION_RUTAS.md` - Documentación detallada del sistema de rutas
- `README.md` - Información básica del proyecto

---

## 🎯 Próximos Pasos

### Funcionalidades Pendientes
- [ ] Implementar autenticación JWT
- [ ] Agregar tests unitarios
- [ ] Implementar lazy loading de rutas
- [ ] Agregar internacionalización (i18n)
- [ ] Mejorar manejo de errores global
- [ ] Implementar caché de datos
- [ ] Agregar PWA capabilities
- [ ] Optimizar bundle size

### Mejoras de UX
- [ ] Skeleton loaders
- [ ] Animaciones de transición
- [ ] Toast notifications
- [ ] Confirmaciones de acciones
- [ ] Modo oscuro

---

## 👥 Convenciones de Código

### Nomenclatura
- **Componentes:** PascalCase (`AdminLayout.jsx`)
- **Servicios:** camelCase (`dashboardService.js`)
- **Variables:** camelCase (`usuarioLogueado`)
- **Constantes:** UPPER_SNAKE_CASE (`API_URL`)

### Estructura de Componentes
```jsx
// 1. Imports
import { useState } from 'react';

// 2. Componente
export default function MiComponente() {
  // 3. Estados
  const [data, setData] = useState([]);
  
  // 4. Efectos
  useEffect(() => {}, []);
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>...</div>;
}
```

---

**Documentación creada por:** Bob  
**Última actualización:** 2026-05-22  
**Versión:** 1.0.0