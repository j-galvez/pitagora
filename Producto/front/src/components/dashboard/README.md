# Dashboard - Explicación Técnica

## 📐 Componentes

El dashboard está compuesto por 3 componentes principales:

### KPICard
- Tarjetas de estadísticas principales
- Props: `titulo`, `valor`, `icono`, `color`
- Muestra: Total Tickets, Tickets Abiertos, Observaciones Abiertas, Urgentes

### TopFallasChart
- Gráfico de barras con el Top 5 de fallas
- Props: `datos` (array con `nombreCategoria` y `cantidad`)
- Visualización con barras de progreso escaladas

### PieChartExpandable
- Gráfico de torta interactivo (SVG)
- Props: `datos`, `titulo`
- Click en segmento → Modal con detalles
- Incluye acciones rápidas (Ver Tickets, Asignar Técnico)

## 🔌 Endpoints API

```
GET http://localhost:8080/api/dashboard/stats
  └─ { totalTickets, ticketsAbiertos, observacionesAbiertas, observacionesAltaUrgencia }

GET http://localhost:8080/api/dashboard/top-fallas
  └─ Array[{ nombreCategoria, cantidad }]
```

## 🔄 Flujo de Carga

1. `IndexAdmin` carga ambos endpoints en **paralelo** con `Promise.all()`
2. Mientras carga → Spinner
3. Si error → Alerta dismissible
4. Datos cargados → Renderiza componentes

## 📊 Estructura del Dashboard

```
Dashboard Admin
├─ KPIs (4 tarjetas)
├─ Gráficos
│  ├─ TopFallasChart
│  └─ PieChartExpandable
├─ Panel de Acciones Rápidas
└─ Resumen General
```

**Responsive**: Grid Bootstrap en móvil (col-12), tablet (col-sm-6), desktop (col-lg-3/6)
