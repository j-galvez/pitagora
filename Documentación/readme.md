---

## Contenido por carpeta

### 📁 00_Gestion_del_Proyecto
Documentos relacionados con la planificación, constitución y seguimiento del proyecto.

| Subcarpeta | Contenido |
|---|---|
| `01_Actas_y_Constitucion` | Acta de constitución del proyecto, actas de reunión con el cliente (Francisco Castillo) y el docente |
| `02_Planificacion_y_Cronograma` | Carta Gantt, matriz de riesgos y estructura de roles y responsabilidades |
| `03_Informe_de_Avance` | Estados de Avance N°1, N°2 y N°3 entregados durante el semestre |

---

### 📁 01_Analisis_Requerimientos
Documentos que formalizan el levantamiento de requerimientos y el diagnóstico de la problemática.

| Subcarpeta | Contenido |
|---|---|
| `01_Definicion_del_Problema` | Diagrama de Ishikawa, árbol de problemas |
| `02_Estado_del_Arte_y_Homologacion` | Análisis de mercado, tabla de homologación vs PlanOK y EasyTicket |
| `03_Alcance_y_Objetivos` | Documento de requerimientos funcionales y no funcionales (SRS) derivado de los 24 casos de uso |

---

### 📁 02_Arquitectura_y_Disenio
Modelado técnico y arquitectónico del sistema.

| Subcarpeta | Contenido |
|---|---|
| `01_Modelo_de_Solucion` | Diagramas de casos de uso, plantillas de casos de uso (CU-1 al CU-24), modelo entidad-relación (MER), diagrama de clases, mockups de interfaz, registro de definición e identificación |
| `02_Infraestructura_Cloud` | Diagrama de arquitectura GCP, manual de instalación y despliegue, plan de despliegue |

---

### 📁 03_Desarrollo_y_Codigo
Documentos técnicos directamente relacionados con la implementación del sistema.

| Documento | Descripción |
|---|---|
| Resumen de avance de casos de uso | Estado de implementación de cada CU, incluyendo nota sobre CU-21 (implementación parcial) |
| Documentación de la API REST | Referencia de endpoints, métodos HTTP, parámetros y respuestas  |
| Changelog / Bitácora de desarrollo | Registro de funcionalidades completadas por sprint |

---

### 📁 04_QA_y_Pruebas
Suite completa de aseguramiento de calidad del MVP, alineada al estándar **ISO/IEC 25010**.

| Documento | Descripción |
|---|---|
| Plan de pruebas | Estrategia, alcance, ambiente y metodología de pruebas |
| Casos de prueba | **96 casos** distribuidos en 4 categorías |
| Informe de resultados QA | 96/96 aprobados · 0 fallos · Cobertura 100% |

**Categorías de prueba ejecutadas:**

| Categoría | Casos | Resultado |
|---|---|---|
| Caja negra funcional (24 CU) | 71 | ✅ 100% aprobado |
| Seguridad y control de acceso | 5 | ✅ 100% aprobado |
| Usabilidad responsive | 9 | ✅ 100% aprobado |
| Integración API ↔ Cloud SQL | 11 | ✅ 100% aprobado |

---

### 📁 05_Cierre_y_Entrega_Final
Documentos de cierre formal del proyecto y entrega al cliente.

| Documento | Descripción |
|---|---|
| Manual de usuario – Administrador | Guía de uso del sistema para el perfil Administrador |
| Manual de usuario – Cliente | Guía de uso del sistema para el perfil Cliente (mandante) |

---

## Relación con el código fuente

La documentación de esta carpeta describe el sistema implementado en `Producto/`. Para referencias técnicas adicionales directamente vinculadas al código, consultar:

| Documento | Ubicación |
|---|---|
| Ejemplos de endpoints REST | `Producto/back/EJEMPLOS_API.md` |
| Modelo de datos y entidades JPA | `Producto/back/ENTIDADES_MODELO.md` |
| Guía de despliegue en GCP | `Producto/GCP_RECOMENDACIONES_DESPLIEGUE.md` |
| Estado de funcionalidades por CU | `Casos de uso.md` (raíz del repositorio) |

---

## Equipo

| Integrante | Rol técnico | Rol de gestión |
|---|---|---|
| Gissella Aguilar Galindo | Frontend | Analista Funcional / Scrum Master |
| Jorge Gálvez Román | DBA y Backend | Líder / Product Owner |
| Gabriel Miranda Rivera | QA y Testing | Analista de Documentación |

---

> Para agregar un nuevo documento, ubicarlo en la subcarpeta que corresponda a su fase del ciclo de vida y seguir la convención de nombres definida.