# 🥧 Gráfico de Torta Expandible - Documentación

## 📋 Descripción

Componente interactivo de gráfico de torta (pie chart) que se expande al hacer click, mostrando información detallada en un modal de Bootstrap. Perfecto para dashboards modernos e interactivos.

---

## ✨ Características

✅ **Interactivo** - Click en cualquier sección para expandir  
✅ **Responsive** - Se adapta a móvil, tablet y desktop  
✅ **Animaciones suaves** - Hover effects y transiciones  
✅ **Modal Bootstrap** - Expansión en modal nativo  
✅ **Personalizable** - Colores, descripciones, detalles y acciones  
✅ **SVG puro** - No requiere librerías externas de gráficos  
✅ **PropTypes** - Validación de datos  
✅ **Efecto Donut** - Círculo central con total  

---

## 🎯 Casos de Uso

1. **Distribución de categorías de fallas**
2. **Estados de tickets** (Abierto, En Proceso, Completado, Cerrado)
3. **Tickets por obra/proyecto**
4. **Distribución de urgencias** (Alta, Media, Baja)
5. **Técnicos asignados** (Carga de trabajo)
6. **Tipos de observaciones**
7. **Clientes con más tickets**

---

## 📦 Instalación

El componente ya está creado en:
```
src/components/dashboard/PieChartExpandable.jsx
```

**Dependencias necesarias:**
- React 19.2.4 ✅ (Ya instalado)
- React Bootstrap 2.10.10 ✅ (Ya instalado)
- Bootstrap Icons ✅ (Ya instalado)

**No requiere instalación adicional** - Todo está incluido en tu proyecto.

---

## 🚀 Uso Básico

### Importar el componente

```jsx
import PieChartExpandable from '../../components/dashboard/PieChartExpandable';
```

### Ejemplo mínimo

```jsx
const datos = [
  { nombre: 'Eléctrico', valor: 15 },
  { nombre: 'Plomería', valor: 12 },
  { nombre: 'Pintura', valor: 8 }
];

<PieChartExpandable
  titulo="Distribución de Fallas"
  datos={datos}
/>
```

---

## 📊 Estructura de Datos

### Props del Componente

```typescript
{
  titulo: string,           // Título del gráfico (opcional)
  datos: Array<{
    nombre: string,         // Nombre de la sección (REQUERIDO)
    valor: number,          // Valor numérico (REQUERIDO)
    color: string,          // Color hex (opcional, auto-asignado)
    descripcion: string,    // Descripción detallada (opcional)
    detalles: Array<{       // Detalles adicionales (opcional)
      titulo: string,
      subtitulo: string,
      valor: string|number
    }>,
    acciones: Array<{       // Botones de acción (opcional)
      texto: string,
      icono: string,        // Clase de Bootstrap Icons
      onClick: function
    }>
  }>
}
```

---

## 🎨 Ejemplos Completos

### Ejemplo 1: Básico (Solo datos)

```jsx
const datosBasicos = [
  { nombre: 'Eléctrico', valor: 15 },
  { nombre: 'Plomería', valor: 12 },
  { nombre: 'Pintura', valor: 8 },
  { nombre: 'Carpintería', valor: 5 }
];

<PieChartExpandable
  titulo="Categorías de Fallas"
  datos={datosBasicos}
/>
```

**Resultado:**
- Gráfico de torta con 4 secciones
- Colores automáticos de la paleta Pitagora
- Click abre modal con información básica

---

### Ejemplo 2: Con Colores Personalizados

```jsx
const datosConColores = [
  { 
    nombre: 'Tickets Abiertos', 
    valor: 25,
    color: '#dc3545'  // Rojo
  },
  { 
    nombre: 'En Proceso', 
    valor: 18,
    color: '#ffc107'  // Amarillo
  },
  { 
    nombre: 'Completados', 
    valor: 42,
    color: '#198754'  // Verde
  }
];

<PieChartExpandable
  titulo="Estado de Tickets"
  datos={datosConColores}
/>
```

---

### Ejemplo 3: Completo (Con todo)

```jsx
const datosCompletos = [
  {
    nombre: 'Eléctrico',
    valor: 15,
    color: '#003860',
    descripcion: 'Problemas relacionados con instalaciones eléctricas, enchufes, interruptores y luminarias.',
    detalles: [
      { 
        titulo: 'Enchufes defectuosos', 
        subtitulo: 'Departamentos 301-305', 
        valor: 8 
      },
      { 
        titulo: 'Interruptores', 
        subtitulo: 'Áreas comunes', 
        valor: 4 
      },
      { 
        titulo: 'Luminarias', 
        subtitulo: 'Varios pisos', 
        valor: 3 
      }
    ],
    acciones: [
      {
        texto: 'Ver Tickets',
        icono: 'bi bi-file-text',
        onClick: () => navigate('/admin/tickets?categoria=electrico')
      },
      {
        texto: 'Asignar Técnico',
        icono: 'bi bi-person-plus',
        onClick: () => alert('Asignar técnico')
      }
    ]
  },
  // ... más categorías
];

<PieChartExpandable
  titulo="Análisis Detallado de Fallas"
  datos={datosCompletos}
/>
```

---

## 🏗️ Integración en Dashboard Admin

### Paso 1: Importar en IndexAdmin.jsx

```jsx
import PieChartExpandable from '../../components/dashboard/PieChartExpandable';
```

### Paso 2: Crear estado para los datos

```jsx
export default function IndexAdmin() {
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosGrafico();
  }, []);

  const cargarDatosGrafico = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:8080/api/dashboard/distribucion-categorias'
      );
      const data = await response.json();
      
      // Transformar datos del backend
      const datosFormateados = data.map(item => ({
        nombre: item.nombreCategoria,
        valor: item.cantidad,
        color: item.color,
        descripcion: item.descripcion,
        detalles: item.detalles || []
      }));
      
      setDatosGrafico(datosFormateados);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="row g-4">
        {/* KPIs existentes */}
        <div className="col-12 col-lg-6">
          <PieChartExpandable
            titulo="Distribución de Categorías"
            datos={datosGrafico}
          />
        </div>
        
        {/* Otros componentes */}
      </div>
    </AdminLayout>
  );
}
```

---

## 🎨 Paleta de Colores

### Colores Automáticos (si no especificas)

```javascript
const coloresDefault = [
  '#003860', // Azul Pitagora (Principal)
  '#0dcaf0', // Info (Azul claro)
  '#198754', // Success (Verde)
  '#ffc107', // Warning (Amarillo)
  '#dc3545', // Danger (Rojo)
  '#6c757d', // Secondary (Gris)
  '#91ABC6', // Azul claro Pitagora
  '#ED1C25'  // Rojo Pitagora
];
```

### Colores Recomendados por Tipo

```javascript
// Estados de tickets
const coloresEstados = {
  abierto: '#dc3545',      // Rojo (urgente)
  enProceso: '#ffc107',    // Amarillo (en trabajo)
  completado: '#198754',   // Verde (listo)
  cerrado: '#6c757d'       // Gris (archivado)
};

// Urgencias
const coloresUrgencia = {
  alta: '#dc3545',         // Rojo
  media: '#ffc107',        // Amarillo
  baja: '#198754'          // Verde
};

// Categorías
const coloresCategorias = {
  electrico: '#003860',    // Azul oscuro
  plomeria: '#0dcaf0',     // Azul claro
  pintura: '#198754',      // Verde
  carpinteria: '#ffc107'   // Amarillo
};
```

---

## 🎭 Características Visuales

### Efectos de Hover

```javascript
// Al pasar el mouse sobre una sección:
- Opacidad aumenta de 0.9 a 1.0
- Escala aumenta ligeramente (scale 1.05)
- Cursor cambia a pointer
- Transición suave de 0.3s
```

### Animaciones

```javascript
// Modal
- Fade in/out suave
- Backdrop con blur
- Centrado en pantalla

// Secciones del gráfico
- Hover effect con transform
- Transiciones CSS suaves
```

### Responsive

```
MÓVIL (< 768px)
┌─────────────┐
│   Gráfico   │
├─────────────┤
│   Leyenda   │
└─────────────┘

DESKTOP (> 768px)
┌──────────┬──────────┐
│          │          │
│ Gráfico  │ Leyenda  │
│          │          │
└──────────┴──────────┘
```

---

## 🔧 Personalización Avanzada

### Cambiar tamaño del gráfico

```jsx
// En PieChartExpandable.jsx, línea ~75
<svg 
  viewBox="0 0 200 200" 
  style={{ maxWidth: '400px', width: '100%' }}  // Cambiar maxWidth
>
```

### Cambiar grosor del donut

```jsx
// Línea ~95 - Radio del círculo central
<circle
  cx="100"
  cy="100"
  r="50"  // Cambiar este valor (50 = donut, 0 = torta completa)
  fill="white"
/>
```

### Personalizar el modal

```jsx
// Cambiar tamaño del modal
<Modal show={showModal} onHide={handleClose} size="xl" centered>
// Opciones: sm, lg, xl

// Cambiar color del header
<Modal.Header 
  closeButton 
  style={{ 
    backgroundColor: selectedSegment?.color,
    color: 'white' 
  }}
>
```

---

## 📱 Ejemplo de Respuesta del Backend

### Endpoint recomendado

```
GET /api/dashboard/distribucion-categorias
```

### Respuesta JSON

```json
[
  {
    "nombreCategoria": "Eléctrico",
    "cantidad": 15,
    "color": "#003860",
    "descripcion": "Problemas eléctricos en general",
    "detalles": [
      {
        "titulo": "Enchufes defectuosos",
        "subtitulo": "Departamentos 301-305",
        "valor": 8
      },
      {
        "titulo": "Interruptores",
        "subtitulo": "Áreas comunes",
        "valor": 4
      }
    ]
  },
  {
    "nombreCategoria": "Plomería",
    "cantidad": 12,
    "color": "#0dcaf0",
    "descripcion": "Fugas y problemas de cañerías"
  }
]
```

---

## 🎯 Casos de Uso Específicos para Pitagora

### 1. Dashboard Admin - Categorías de Fallas

```jsx
<PieChartExpandable
  titulo="Top 5 Categorías de Fallas"
  datos={topCategorias}
/>
```

**Muestra:**
- Distribución de fallas por categoría
- Click → Detalles de cada categoría
- Botón "Ver Tickets" → Filtra tickets por categoría

---

### 2. Dashboard Admin - Estados de Tickets

```jsx
<PieChartExpandable
  titulo="Estado Actual de Tickets"
  datos={estadosTickets}
/>
```

**Muestra:**
- Abiertos, En Proceso, Completados, Cerrados
- Click → Detalles por estado
- Botón "Gestionar" → Va a lista filtrada

---

### 3. Dashboard Admin - Distribución por Obra

```jsx
<PieChartExpandable
  titulo="Tickets por Proyecto"
  datos={ticketsPorObra}
/>
```

**Muestra:**
- Tickets activos por cada obra
- Click → Información de la obra
- Botón "Ver Obra" → Detalle del proyecto

---

### 4. Dashboard Cliente - Mis Tickets

```jsx
<PieChartExpandable
  titulo="Estado de Mis Solicitudes"
  datos={misTickets}
/>
```

**Muestra:**
- Estados de tickets del cliente
- Click → Detalles de cada estado
- Botón "Ver Detalle" → Abre ticket específico

---

## 🔍 Debugging

### Verificar datos

```jsx
console.log('Datos del gráfico:', datos);
console.log('Total calculado:', datos.reduce((sum, item) => sum + item.valor, 0));
```

### Verificar colores

```jsx
// En el componente, agregar:
useEffect(() => {
  console.log('Segmentos generados:', segments);
}, [datos]);
```

### Verificar modal

```jsx
// Verificar que el modal se abre
const handleSegmentClick = (segment) => {
  console.log('Segmento clickeado:', segment);
  setSelectedSegment(segment);
  setShowModal(true);
};
```

---

## ⚡ Performance

### Optimizaciones incluidas

✅ **Cálculos memoizados** - Los ángulos se calculan una vez  
✅ **SVG nativo** - No requiere canvas ni librerías pesadas  
✅ **Lazy rendering** - Modal solo se renderiza cuando se abre  
✅ **CSS transitions** - Animaciones con GPU  

### Recomendaciones

```jsx
