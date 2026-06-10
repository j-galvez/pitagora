# 📊 Explicación Detallada del Dashboard - Sistema Pitagora

## 🎯 Resumen Ejecutivo

El sistema tiene **DOS dashboards principales** según el rol del usuario:
1. **Dashboard Admin** (`/admin-dashboard`) - Para administradores
2. **Dashboard Cliente** (`/dashboard`) - Para clientes/usuarios

Ambos utilizan **componentes reutilizables** que se encuentran en `src/components/dashboard/`.

---

## 📍 Páginas Principales

### 1. Dashboard Administrador
**Archivo:** `src/pages/admin/IndexAdmin.jsx`  
**Ruta:** `/admin-dashboard`  
**Acceso:** Solo usuarios con `rol: "admin"`

### 2. Dashboard Cliente
**Archivo:** `src/pages/cliente/IndexUsuario.jsx`  
**Ruta:** `/dashboard`  
**Acceso:** Solo usuarios con `rol: "usuario"` o `rol: "cliente"`

---

## 🧩 Componentes Reutilizables del Dashboard

### 1. **KPICard** - Tarjeta de Indicador Clave

**Ubicación:** `src/components/dashboard/KPICard.jsx`

#### ¿Qué es?
Un componente reutilizable que muestra métricas importantes (KPIs - Key Performance Indicators) en formato de tarjeta visual.

#### Props que recibe:
```javascript
{
  titulo: string,      // Título del KPI (ej: "Total de Tickets")
  valor: number|string, // Valor numérico a mostrar
  icono: ReactElement, // Icono de React Icons
  color: string        // Color del tema: 'primary', 'info', 'success', 'danger'
}
```

#### Ejemplo de uso:
```jsx
import { FaTicketAlt } from 'react-icons/fa';
import KPICard from '../../components/dashboard/KPICard';

<KPICard
  titulo="Total de Tickets"
  valor={45}
  icono={<FaTicketAlt />}
  color="primary"
/>
```

#### Características:
- ✅ **Responsive**: Se adapta a móvil, tablet y desktop
- ✅ **Flexible**: Acepta cualquier icono de React Icons
- ✅ **Personalizable**: 5 colores disponibles (primary, info, success, warning, danger)
- ✅ **Validación**: Usa PropTypes para validar props
- ✅ **Manejo de null**: Muestra "-" si no hay valor

#### Estructura visual:
```
┌─────────────────────────────┐
│  TOTAL DE TICKETS      🎫  │
│  45                         │
└─────────────────────────────┘
```

---

### 2. **TopFallasChart** - Gráfico de Barras de Fallas

**Ubicación:** `src/components/dashboard/TopFallasChart.jsx`

#### ¿Qué es?
Un componente que visualiza las 5 categorías de fallas más reportadas usando barras de progreso horizontales.

#### Props que recibe:
```javascript
{
  datos: Array<{
    nombreCategoria: string,  // Nombre de la categoría
    cantidad: number          // Cantidad de reportes
  }>
}
```

#### Ejemplo de uso:
```jsx
import TopFallasChart from '../../components/dashboard/TopFallasChart';

const topFallas = [
  { nombreCategoria: "Eléctrico", cantidad: 15 },
  { nombreCategoria: "Plomería", cantidad: 12 },
  { nombreCategoria: "Pintura", cantidad: 8 },
  { nombreCategoria: "Carpintería", cantidad: 5 },
  { nombreCategoria: "Cerrajería", cantidad: 3 }
];

<TopFallasChart datos={topFallas} />
```

#### Características:
- ✅ **Escalado automático**: Las barras se escalan según el valor máximo
- ✅ **Colores diferenciados**: Cada barra tiene un color distinto
- ✅ **Badges con cantidad**: Muestra el número exacto de reportes
- ✅ **Manejo de datos vacíos**: Muestra mensaje si no hay datos
- ✅ **Responsive**: Se adapta al ancho del contenedor

#### Lógica de escalado:
```javascript
// Encuentra el valor máximo
const maxCantidad = Math.max(...datos.map(item => item.cantidad));

// Calcula el porcentaje para cada barra
const porcentaje = (falla.cantidad / maxCantidad) * 100;
```

#### Estructura visual:
```
Top 5 Fallas Más Reportadas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eléctrico        [15]
████████████████████ 100%

Plomería         [12]
████████████████ 80%

Pintura          [8]
███████████ 53%
```

---

## 🏗️ Arquitectura del Dashboard Admin

### Flujo Completo

```
1. Usuario accede a /admin-dashboard
         ↓
2. ProtectedRoute verifica rol="admin"
         ↓
3. IndexAdmin.jsx se monta
         ↓
4. useEffect ejecuta cargarDatosDashboard()
         ↓
5. Llama a dashboardService en paralelo:
   - obtenerEstadisticas()
   - obtenerTopFallas()
         ↓
6. Servicios hacen fetch al backend:
   - GET /api/dashboard/stats
   - GET /api/dashboard/top-fallas
         ↓
7. Backend consulta base de datos
         ↓
8. Retorna JSON con datos
         ↓
9. Componente actualiza estados:
   - setStats(estadisticas)
   - setTopFallas(fallas)
         ↓
10. React re-renderiza con nuevos datos
         ↓
11. Se muestran:
    - 4 KPICards con métricas
    - TopFallasChart con gráfico
    - Panel de acciones rápidas
```

### Código del Dashboard Admin (Simplificado)

```jsx
export default function IndexAdmin() {
  // 1. ESTADOS
  const [stats, setStats] = useState({
    totalTickets: 0,
    ticketsAbiertos: 0,
    observacionesAbiertas: 0,
    observacionesAltaUrgencia: 0
  });
  const [topFallas, setTopFallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. OBTENER USUARIO
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

  // 3. CARGAR DATOS AL MONTAR
  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // 4. FUNCIÓN PARA CARGAR DATOS
  const cargarDatosDashboard = async () => {
    setLoading(true);
    try {
      // Llamadas en paralelo (más rápido)
      const [estadisticas, fallas] = await Promise.all([
        obtenerEstadisticas(),
        obtenerTopFallas()
      ]);
      
      setStats(estadisticas);
      setTopFallas(fallas);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // 5. RENDER
  return (
    <AdminLayout usuario={usuarioLogueado} titulo="Dashboard Administrador">
      {/* KPIs - 4 tarjetas */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <KPICard
            titulo="Total de Tickets"
            valor={stats.totalTickets}
            icono={<FaTicketAlt />}
            color="primary"
          />
        </div>
        {/* ... 3 KPICards más ... */}
      </div>

      {/* Gráfico y Panel */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <TopFallasChart datos={topFallas} />
        </div>
        <div className="col-12 col-lg-4">
          {/* Panel de acciones rápidas */}
        </div>
      </div>
    </AdminLayout>
  );
}
```

---

## 🏗️ Arquitectura del Dashboard Cliente

### Diferencias con el Dashboard Admin

| Aspecto | Dashboard Admin | Dashboard Cliente |
|---------|----------------|-------------------|
| **Componentes** | KPICard + TopFallasChart | CardTicket |
| **Datos** | Estadísticas globales | Tickets del usuario |
| **Layout** | AdminLayout | NavbarUsuario + Footer |
| **Acciones** | Crear obra, cliente, usuario | Crear ticket, observación |
| **Enfoque** | Vista general del sistema | Vista personal |

### Código del Dashboard Cliente (Simplificado)

```jsx
export default function IndexUsuario() {
  // 1. ESTADOS
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 2. OBTENER USUARIO
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

  // 3. CARGAR TICKETS DEL USUARIO
  const cargarMisTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/usuario/${usuarioLogueado.id_usuario}?estado=abierto`
      );
      const data = await response.json();
      setTickets(data || []);
    } catch (err) {
      setError('Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisTickets();
  }, []);

  // 4. LÓGICA DE NEGOCIO
  const openTicket = tickets.find(
    t => t.estado_general === 'abierto' || t.estado_general === 'en proceso'
  );

  // 5. RENDER
  return (
    <div className="d-flex">
      <NavbarUsuario usuario={usuarioLogueado} />
      
      <div className="flex-grow-1">
        <nav>...</nav>
        
        <main>
          <h1>Mis Solicitudes</h1>
          
          {/* Botón condicional */}
          {openTicket ? (
            <button onClick={() => navigate(`/crear-observacion/${openTicket.id_ticket}`)}>
              Gestionar Solicitud Abierta
            </button>
          ) : (
            <button onClick={() => navigate('/crear-ticket')}>
              Nueva Solicitud
            </button>
          )}

          {/* Grid de tickets */}
          <div className="row g-4">
            {tickets.map(ticket => (
              <div className="col-md-6 col-lg-4" key={ticket.id_ticket}>
                <CardTicket ticket={ticket} />
              </div>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
```

---

## 📊 Datos que Maneja el Dashboard

### Dashboard Admin - Estadísticas

```javascript
// Respuesta de GET /api/dashboard/stats
{
  "totalTickets": 45,
  "ticketsAbiertos": 12,
  "observacionesAbiertas": 28,
  "observacionesAltaUrgencia": 5
}
```

### Dashboard Admin - Top Fallas

```javascript
// Respuesta de GET /api/dashboard/top-fallas
[
  {
    "nombreCategoria": "Eléctrico",
    "cantidad": 15
  },
  {
    "nombreCategoria": "Plomería",
    "cantidad": 12
  },
  {
    "nombreCategoria": "Pintura",
    "cantidad": 8
  },
  {
    "nombreCategoria": "Carpintería",
    "cantidad": 5
  },
  {
    "nombreCategoria": "Cerrajería",
    "cantidad": 3
  }
]
```

### Dashboard Cliente - Tickets

```javascript
// Respuesta de GET /api/tickets/usuario/:id
[
  {
    "id_ticket": 1,
    "titulo": "Fuga de agua en baño",
    "descripcion": "...",
    "estado_general": "abierto",
    "fecha_creacion": "2024-01-15",
    "categoria": "Plomería",
    "urgencia": "alta"
  },
  // ... más tickets
]
```

---

## 🎨 Layout y Diseño

### Grid Responsive del Dashboard Admin

```jsx
{/* Fila de KPIs - 4 columnas */}
<div className="row g-4 mb-4">
  <div className="col-12 col-sm-6 col-lg-3">
    {/* En móvil: 100% ancho (1 por fila) */}
    {/* En tablet: 50% ancho (2 por fila) */}
    {/* En desktop: 25% ancho (4 por fila) */}
    <KPICard />
  </div>
  {/* ... 3 más ... */}
</div>

{/* Fila de Gráfico + Panel */}
<div className="row g-4">
  <div className="col-12 col-lg-8">
    {/* Gráfico ocupa 8/12 en desktop */}
    <TopFallasChart />
  </div>
  <div className="col-12 col-lg-4">
    {/* Panel ocupa 4/12 en desktop */}
    {/* Acciones rápidas */}
  </div>
</div>
```

### Breakpoints Visuales

```
MÓVIL (< 576px)
┌─────────────┐
│   KPI 1     │
├─────────────┤
│   KPI 2     │
├─────────────┤
│   KPI 3     │
├─────────────┤
│   KPI 4     │
├─────────────┤
│  Gráfico    │
├─────────────┤
│   Panel     │
└─────────────┘

TABLET (576px - 992px)
┌──────────┬──────────┐
│  KPI 1   │  KPI 2   │
├──────────┼──────────┤
│  KPI 3   │  KPI 4   │
├──────────┴──────────┤
│     Gráfico         │
├─────────────────────┤
│      Panel          │
└─────────────────────┘

DESKTOP (> 992px)
┌─────┬─────┬─────┬─────┐
│ KPI1│ KPI2│ KPI3│ KPI4│
├─────┴─────┴─────┼─────┤
│                 │     │
│    Gráfico      │Panel│
│                 │     │
└─────────────────┴─────┘
```

---

## 🔄 Estados del Dashboard

### Estados de Carga

```jsx
// 1. LOADING (Cargando datos)
{loading && (
  <div className="text-center py-5">
    <div className="spinner-border text-primary"></div>
    <p>Cargando estadísticas...</p>
  </div>
)}

// 2. ERROR (Error al cargar)
{error && (
  <div className="alert alert-danger">
    {error}
    <button onClick={() => setError('')}>×</button>
  </div>
)}

// 3. SUCCESS (Datos cargados)
{!loading && !error && (
  <>
    <KPICards />
    <TopFallasChart />
  </>
)}

// 4. EMPTY (Sin datos)
{!loading && datos.length === 0 && (
  <div className="alert alert-light">
    No hay datos disponibles
  </div>
)}
```

---

## 🎯 Componentes Adicionales del Dashboard

### Panel de Acciones Rápidas (Admin)

```jsx
<div className="card">
  <div className="card-body">
    <h5>Acciones Rápidas</h5>
    <div className="d-grid gap-2">
      <button onClick={() => navigate('/crear-obra')}>
        Nueva Obra
      </button>
      <button onClick={() => navigate('/crear-cliente')}>
        Nuevo Cliente
      </button>
      <button onClick={() => navigate('/crear-usuario')}>
        Nuevo Usuario
      </button>
    </div>
  </div>
</div>
```

### Panel de Resumen (Admin)

```jsx
<div className="card">
  <div className="card-body">
    <h5>Resumen</h5>
    <ul>
      <li>
        <span>Tasa de Tickets Abiertos</span>
        <span className="badge bg-info">
          {Math.round((ticketsAbiertos / totalTickets) * 100)}%
        </span>
      </li>
      <li>
        <span>Observaciones Críticas</span>
        <span className="badge bg-danger">
          {observacionesAltaUrgencia}
        </span>
      </li>
    </ul>
  </div>
</div>
```

---

## 🔧 Personalización de Componentes

### Extender KPICard

```jsx
// Agregar tendencia (↑ ↓)
<KPICard
  titulo="Total de Tickets"
  valor={45}
  icono={<FaTicketAlt />}
  color="primary"
  tendencia="+12%"  // Nueva prop
  tendenciaPositiva={true}
/>
```

### Extender TopFallasChart

```jsx
// Agregar click en barras
<TopFallasChart
  datos={topFallas}
  onBarClick={(falla) => {
    navigate(`/tickets?categoria=${falla.nombreCategoria}`);
  }}
/>
```

---

## 📱 Responsive Behavior

### KPICard en diferentes tamaños

```css
/* Móvil */
.col-12 {
  width: 100%;  /* 1 tarjeta por fila */
}

/* Tablet */
.col-sm-6 {
  width: 50%;   /* 2 tarjetas por fila */
}

/* Desktop */
.col-lg-3 {
  width: 25%;   /* 4 tarjetas por fila */
}
```

### TopFallasChart adaptativo

```jsx
// El componente se adapta automáticamente al ancho del contenedor
<div className="col-12 col-lg-8">
  {/* En móvil: 100% ancho */}
  {/* En desktop: 66.67% ancho */}
  <TopFallasChart datos={topFallas} />
</div>
```

---

## 🎨 Paleta de Colores de KPIs

```javascript
// Colores disponibles para KPICard
const colores = {
  primary: '#003860',   // Azul Pitagora
  info: '#0dcaf0',      // Azul claro
  success: '#198754',   // Verde
  warning: '#ffc107',   // Amarillo
  danger: '#dc3545',    // Rojo
  secondary: '#6c757d'  // Gris
};

// Uso recomendado:
// primary   → Métricas principales (Total)
// info      → Métricas en proceso
// success   → Métricas positivas (Completados)
// warning   → Métricas de atención (Pendientes)
// danger    → Métricas críticas (Urgentes)
```

---

## 🚀 Optimizaciones

### Carga Paralela de Datos

```javascript
// ❌ MAL - Secuencial (lento)
const stats = await obtenerEstadisticas();
const fallas = await obtenerTopFallas();

// ✅ BIEN - Paralelo (rápido)
const [stats, fallas] = await Promise.all([
  obtenerEstadisticas(),
  obtenerTopFallas()
]);
```

### Memoización de Componentes

```javascript
// Evitar re-renders innecesarios
import { memo } from 'react';

const KPICard = memo(({ titulo, valor, icono, color }) => {
  // ... componente
});

// Solo re-renderiza si las props cambian
```

---

## 📊 Resumen de Componentes Reutilizables

| Componente | Ubicación | Usado en | Propósito |
|------------|-----------|----------|-----------|
| **KPICard** | `components/dashboard/` | Dashboard Admin | Mostrar métricas clave |
| **TopFallasChart** | `components/dashboard/` | Dashboard Admin | Visualizar top fallas |
| **CardTicket** | `components/` | Dashboard Cliente | Mostrar ticket individual |
| **AdminLayout** | `components/` | Todas páginas admin | Layout wrapper admin |
| **NavbarAdmin** | `components/` | AdminLayout | Navegación admin |
| **NavbarUsuario** | `components/` | Dashboard Cliente | Navegación cliente |
| **Footer** | `components/` | Dashboard Cliente | Pie de página |

---

## 🎯 Conclusión

### Dashboard Admin
- **Página principal:** `IndexAdmin.jsx` en `/admin-dashboard`
- **Componentes reutilizables:** KPICard, TopFallasChart
- **Datos:** Estadísticas globales del sistema
- **Enfoque:** Vista general para gestión

### Dashboard Cliente
- **Página principal:** `IndexUsuario.jsx` en `/dashboard`
- **Componentes reutilizables:** CardTicket
- **Datos:** Tickets personales del usuario
- **Enfoque:** Vista personal de solicitudes

### Ventajas de los Componentes Reutilizables
✅ **Mantenibilidad** - Cambios en un solo lugar  
✅ **Consistencia** - Mismo diseño en toda la app  
✅ **Escalabilidad** - Fácil agregar nuevos dashboards  
✅ **Testing** - Componentes aislados son más fáciles de probar  
✅ **Performance** - Optimización centralizada  

---

**Documentación creada por:** Bob  
**Última actualización:** 2026-05-22  
**Versión:** 1.0.0