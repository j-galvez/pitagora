import PieChartExpandable from './PieChartExpandable';
import { useNavigate } from 'react-router-dom';

/**
 * EJEMPLO DE USO DEL COMPONENTE PieChartExpandable
 * 
 * Este archivo muestra diferentes formas de usar el componente
 * de gráfico de torta expandible en tu dashboard
 */

export default function EjemploPieChart() {
  const navigate = useNavigate();

  // ============================================
  // EJEMPLO 1: Uso Básico (Solo datos simples)
  // ============================================
  const datosBasicos = [
    { nombre: 'Eléctrico', valor: 15 },
    { nombre: 'Plomería', valor: 12 },
    { nombre: 'Pintura', valor: 8 },
    { nombre: 'Carpintería', valor: 5 },
    { nombre: 'Cerrajería', valor: 3 }
  ];

  // ============================================
  // EJEMPLO 2: Con Colores Personalizados
  // ============================================
  const datosConColores = [
    { 
      nombre: 'Tickets Abiertos', 
      valor: 25,
      color: '#0dcaf0' // Info
    },
    { 
      nombre: 'En Proceso', 
      valor: 18,
      color: '#ffc107' // Warning
    },
    { 
      nombre: 'Completados', 
      valor: 42,
      color: '#198754' // Success
    },
    { 
      nombre: 'Cerrados', 
      valor: 15,
      color: '#6c757d' // Secondary
    }
  ];

  // ============================================
  // EJEMPLO 3: Con Descripción y Detalles
  // ============================================
  const datosCompletos = [
    {
      nombre: 'Eléctrico',
      valor: 15,
      color: '#003860',
      descripcion: 'Problemas relacionados con instalaciones eléctricas, enchufes, interruptores y luminarias.',
      detalles: [
        { titulo: 'Enchufes defectuosos', subtitulo: 'Departamentos 301-305', valor: 8 },
        { titulo: 'Interruptores', subtitulo: 'Áreas comunes', valor: 4 },
        { titulo: 'Luminarias', subtitulo: 'Varios pisos', valor: 3 }
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
          onClick: () => alert('Asignar técnico eléctrico')
        }
      ]
    },
    {
      nombre: 'Plomería',
      valor: 12,
      color: '#0dcaf0',
      descripcion: 'Fugas de agua, problemas en cañerías, grifos y sistemas de desagüe.',
      detalles: [
        { titulo: 'Fugas de agua', subtitulo: 'Baños principales', valor: 7 },
        { titulo: 'Grifos', subtitulo: 'Cocinas', valor: 3 },
        { titulo: 'Desagües', subtitulo: 'Varios', valor: 2 }
      ],
      acciones: [
        {
          texto: 'Ver Tickets',
          icono: 'bi bi-file-text',
          onClick: () => navigate('/admin/tickets?categoria=plomeria')
        }
      ]
    },
    {
      nombre: 'Pintura',
      valor: 8,
      color: '#198754',
      descripcion: 'Retoques de pintura, manchas en paredes y problemas de acabados.',
      detalles: [
        { titulo: 'Manchas en paredes', valor: 5 },
        { titulo: 'Retoques necesarios', valor: 3 }
      ]
    },
    {
      nombre: 'Carpintería',
      valor: 5,
      color: '#ffc107',
      descripcion: 'Puertas, ventanas, closets y muebles empotrados.',
      detalles: [
        { titulo: 'Puertas desajustadas', valor: 3 },
        { titulo: 'Closets', valor: 2 }
      ]
    }
  ];

  // ============================================
  // EJEMPLO 4: Estados de Tickets
  // ============================================
  const datosEstados = [
    {
      nombre: 'Abiertos',
      valor: 25,
      color: '#dc3545',
      descripcion: 'Tickets que aún no han sido asignados o iniciados.',
      detalles: [
        { titulo: 'Alta prioridad', valor: 8 },
        { titulo: 'Media prioridad', valor: 12 },
        { titulo: 'Baja prioridad', valor: 5 }
      ],
      acciones: [
        {
          texto: 'Asignar Todos',
          icono: 'bi bi-check-all',
          onClick: () => alert('Asignar tickets abiertos')
        }
      ]
    },
    {
      nombre: 'En Proceso',
      valor: 18,
      color: '#ffc107',
      descripcion: 'Tickets actualmente siendo trabajados por técnicos.',
      detalles: [
        { titulo: 'Técnico Juan Pérez', valor: 6 },
        { titulo: 'Técnico María González', valor: 7 },
        { titulo: 'Técnico Carlos Ruiz', valor: 5 }
      ]
    },
    {
      nombre: 'Completados',
      valor: 42,
      color: '#198754',
      descripcion: 'Tickets finalizados pendientes de validación del cliente.',
      detalles: [
        { titulo: 'Pendiente validación', valor: 15 },
        { titulo: 'Validados', valor: 27 }
      ]
    },
    {
      nombre: 'Cerrados',
      valor: 15,
      color: '#6c757d',
      descripcion: 'Tickets completamente cerrados y archivados.',
      detalles: [
        { titulo: 'Este mes', valor: 15 },
        { titulo: 'Mes anterior', valor: 23 }
      ]
    }
  ];

  // ============================================
  // EJEMPLO 5: Distribución por Obra
  // ============================================
  const datosPorObra = [
    {
      nombre: 'Edificio Los Almendros',
      valor: 28,
      color: '#003860',
      descripcion: 'Proyecto residencial de 15 pisos en Las Condes.',
      detalles: [
        { titulo: 'Departamentos', subtitulo: '45 unidades', valor: 45 },
        { titulo: 'Tickets activos', valor: 28 },
        { titulo: 'Avance', subtitulo: 'Postventa', valor: '85%' }
      ],
      acciones: [
        {
          texto: 'Ver Obra',
          icono: 'bi bi-building',
          onClick: () => navigate('/admin/obras/1')
        },
        {
          texto: 'Generar Reporte',
          icono: 'bi bi-file-earmark-pdf',
          onClick: () => alert('Generando reporte PDF...')
        }
      ]
    },
    {
      nombre: 'Condominio Vista Mar',
      valor: 15,
      color: '#0dcaf0',
      descripcion: 'Casas en condominio cerrado en Viña del Mar.',
      detalles: [
        { titulo: 'Casas', subtitulo: '20 unidades', valor: 20 },
        { titulo: 'Tickets activos', valor: 15 }
      ]
    },
    {
      nombre: 'Torre Central',
      valor: 12,
      color: '#198754',
      descripcion: 'Edificio corporativo en Santiago Centro.',
      detalles: [
        { titulo: 'Oficinas', valor: 30 },
        { titulo: 'Tickets activos', valor: 12 }
      ]
    }
  ];

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Ejemplos de Gráficos de Torta Expandibles</h2>

      {/* Ejemplo 1: Básico */}
      <div className="mb-5">
        <h4 className="mb-3">1. Uso Básico</h4>
        <PieChartExpandable
          titulo="Distribución de Fallas"
          datos={datosBasicos}
        />
      </div>

      {/* Ejemplo 2: Con colores personalizados */}
      <div className="mb-5">
        <h4 className="mb-3">2. Con Colores Personalizados</h4>
        <PieChartExpandable
          titulo="Estado de Tickets"
          datos={datosConColores}
        />
      </div>

      {/* Ejemplo 3: Completo con detalles y acciones */}
      <div className="mb-5">
        <h4 className="mb-3">3. Completo (con descripción, detalles y acciones)</h4>
        <PieChartExpandable
          titulo="Categorías de Fallas Detalladas"
          datos={datosCompletos}
        />
      </div>

      {/* Ejemplo 4: Estados de tickets */}
      <div className="mb-5">
        <h4 className="mb-3">4. Estados de Tickets</h4>
        <PieChartExpandable
          titulo="Distribución por Estado"
          datos={datosEstados}
        />
      </div>

      {/* Ejemplo 5: Por obra */}
      <div className="mb-5">
        <h4 className="mb-3">5. Distribución por Obra</h4>
        <PieChartExpandable
          titulo="Tickets por Proyecto"
          datos={datosPorObra}
        />
      </div>
    </div>
  );
}

// ============================================
// CÓMO INTEGRAR EN TU DASHBOARD ADMIN
// ============================================

/*
// En IndexAdmin.jsx

import PieChartExpandable from '../../components/dashboard/PieChartExpandable';

export default function IndexAdmin() {
  const [datosGrafico, setDatosGrafico] = useState([]);

  useEffect(() => {
    cargarDatosGrafico();
  }, []);

  const cargarDatosGrafico = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/distribucion-categorias');
      const data = await response.json();
      
      // Transformar datos del backend al formato del componente
      const datosFormateados = data.map(item => ({
        nombre: item.nombreCategoria,
        valor: item.cantidad,
        descripcion: item.descripcion,
        detalles: item.detalles || []
      }));
      
      setDatosGrafico(datosFormateados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-lg-6">
          <PieChartExpandable
            titulo="Distribución de Categorías"
            datos={datosGrafico}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
*/

// Made with Bob