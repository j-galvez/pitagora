# 📋 Documentación de Entidades del Modelo de Datos

Sistema de Postventa Constructora Pitágora - Especificación de Entities JPA

---

## 📑 Tabla de Contenidos

1. [Clientes](#clientes)
2. [Usuarios](#usuarios)
3. [Obras](#obras)
4. [Categorias](#categorias)
5. [Tickets](#tickets)
6. [Observaciones](#observaciones)
7. [Evidencias](#evidencias)
8. [Mensajes](#mensajes)
9. [HistorialBitacora](#historial-bitacora)
10. [ObrasUsuarios](#obras-usuarios)

---

## Clientes

**Tabla:** `clientes`  
**Propósito:** Almacena las empresas clientes de la constructora (Ej: UC, Komatsu, Comercio)

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_cliente` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `nombre_empresa` | String(150) | NO | - | Nombre de la empresa cliente |
| `rut` | String(20) | NO | UNIQUE | RUT - Identificación legal única |
| `correo_contacto` | String(100) | SÍ | - | Email de contacto principal |
| `telefono` | String(20) | SÍ | - | Teléfono de contacto |
| `direccion` | Text | SÍ | - | Dirección principal |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |
| `estado` | EstadoEnum | NO | DEFAULT 'Activo' | Estado: ACTIVO, INACTIVO |

### Relaciones

- **1 → N con Obras:** Un cliente puede tener múltiples obras

### Enums

```java
public enum EstadoEnum {
    ACTIVO("Activo"),
    INACTIVO("Inactivo");
}
```

---

## Usuarios

**Tabla:** `usuarios`  
**Propósito:** Gestiona la autenticación y autorización de usuarios con roles específicos

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_usuario` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | String(100) | NO | - | Nombre completo del usuario |
| `correo` | String(100) | NO | UNIQUE | Correo corporativo (login) |
| `password` | String(255) | NO | - | Hash de contraseña (bcrypt) |
| `rol` | RolEnum | NO | DEFAULT 'cliente' | Rol asignado al usuario |
| `id_obra` | Integer | SÍ | FK → obras | Obra asignada (solo para 'cliente') |
| `telefono` | String(20) | SÍ | - | Teléfono de contacto |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |
| `estado` | EstadoEnum | NO | DEFAULT 'Activo' | Estado: ACTIVO, INACTIVO |

### Relaciones

- **N → 1 con Obras:** (Opcional) Un usuario cliente está restringido a una única obra
- **N → M con Obras:** (A través de `obras_usuarios`) Un usuario admin/técnico puede trabajar en múltiples obras
- **1 → N con Tickets:** Un usuario puede crear múltiples tickets
- **1 → N con Mensajes:** Un usuario puede enviar múltiples mensajes
- **1 → N con HistorialBitacora:** Un usuario es autor de acciones registradas

### Enums

```java
public enum RolEnum {
    ADMIN("admin"),              // Administrador del sistema
    JEFE_OBRA("jefe_obra"),      // Jefe de obra - supervisa proyectos
    CLIENTE("cliente"),          // Cliente final - solo ve su obra
    TECNICO("tecnico");          // Técnico - ejecuta reparaciones
}

public enum EstadoEnum {
    ACTIVO("Activo"),
    INACTIVO("Inactivo");
}
```

### Validaciones de Negocio

- Si `rol = 'CLIENTE'` → `id_obra` NO PUEDE SER NULL
- Si `rol != 'CLIENTE'` → `id_obra` PUEDE SER NULL
- `correo` es ÚNICO (usado como nombre de usuario)

---

## Obras

**Tabla:** `obras`  
**Propósito:** Representa proyectos/unidades de construcción de los clientes

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_obra` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_cliente` | Integer | NO | FK → clientes | Cliente propietario de la obra |
| `nombre_obra` | String(150) | NO | - | Nombre del proyecto/unidad |
| `descripcion_obra` | Text | SÍ | - | Descripción detallada (Ej: "Depto en piso 3") |
| `direccion` | Text | SÍ | - | Ubicación del proyecto |
| `planos_presupuestos` | String(500) | SÍ | - | URL a documentos en Cloud Storage |
| `fecha_entrega` | LocalDate | SÍ | - | Fecha de entrega programada |
| `garantia_expira` | LocalDate | SÍ | - | Fecha de vencimiento de garantía (3 años) |
| `estado_obra` | EstadoObraEnum | NO | DEFAULT 'Activa' | Estado de la obra |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |

### Relaciones

- **N → 1 con Clientes:** Múltiples obras pertenecen a un cliente
- **1 → N con Tickets:** Una obra puede tener múltiples tickets
- **N → M con Usuarios:** (A través de `obras_usuarios`) Asignación de trabajadores
- **1 → N con Observaciones:** (Indirecta a través de tickets)

### Enums

```java
public enum EstadoObraEnum {
    ACTIVA("Activa"),                      // En proceso de reparación
    GARANTIA_VENCIDA("Garantía Vencida"),  // Garantía expirada
    CERRADA("Cerrada");                    // Proyecto finalizado
}
```

---

## Categorias

**Tabla:** `categorias`  
**Propósito:** Maestro de categorías de fallas predefinidas para normalizar registros

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_categoria` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `nombre_categoria` | String(100) | NO | - | Ej: "Instalaciones Sanitarias" |
| `subcategoria` | String(100) | SÍ | - | Ej: "Tuberías", "Grifería", "Cerámica" |
| `descripcion` | Text | SÍ | - | Descripción de la categoría |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |

### Relaciones

- **1 → N con Observaciones:** Una categoría clasifica múltiples observaciones

### Propósito

Evita que clientes ingresen textos vagos o ambiguos. Permite generar reportes estadísticos sobre tipos de fallas más comunes.

---

## Tickets

**Tabla:** `tickets`  
**Propósito:** Contenedor agrupador de problemas por obra (1 ticket = múltiples observaciones)

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_ticket` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_obra` | Integer | NO | FK → obras | Obra a la que pertenece |
| `id_usuario_creador` | Integer | NO | FK → usuarios | Usuario que creó el ticket |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |
| `estado_general` | EstadoTicketEnum | NO | DEFAULT 'abierto' | Estado del ticket |

### Relaciones

- **N → 1 con Obras:** Múltiples tickets por obra
- **N → 1 con Usuarios:** Usuario creador
- **1 → N con Observaciones:** Un ticket agrupa múltiples observaciones (problemas)

### Enums

```java
public enum EstadoTicketEnum {
    ABIERTO("abierto"),          // Recién creado
    EN_PROCESO("en proceso"),    // En reparación
    TERMINADO("terminado");      // Completado
}
```

### Lógica de Negocio

**CRÍTICO:** Un único ticket agrupa TODOS los problemas reportados en una obra en una misma ocasión. NO se crean 50 tickets para 50 problemas (per Francisco Castillo's requirement).

---

## Observaciones

**Tabla:** `observaciones`  
**Propósito:** Unidad atómica de trabajo - cada observación es un problema específico a resolver

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_observacion` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_ticket` | Integer | NO | FK → tickets | Ticket contenedor |
| `id_categoria` | Integer | NO | FK → categorias | Clasificación de la falla |
| `falla` | String(200) | NO | - | Título: "Grieta en muro" |
| `ubicacion_exacta` | String(255) | NO | - | Localización: "Baño N°4, Fachada Oriente" |
| `descripcion_problema` | Text | NO | - | Descripción detallada del problema |
| `urgencia` | UrgenciaEnum | NO | DEFAULT 'media' | Nivel de prioridad |
| `estado_observacion` | EstadoObservacionEnum | NO | DEFAULT 'pendiente' | Estado actual |
| `confirmacion_cliente` | ConfirmacionClienteEnum | NO | DEFAULT 'pendiente' | Aprobación del cliente |
| `fecha_confirmacion` | LocalDateTime | SÍ | - | Cuándo cliente aprobó |
| `comentario_cliente` | Text | SÍ | - | Comentarios del cliente |
| `token_aceptacion` | String(100) | SÍ | UNIQUE | Token para link de confirmación |
| `intentos_recordatorio` | Integer | SÍ | DEFAULT 0 | Recordatorios enviados (máx 4) |
| `fecha_registro` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Fecha de creación (inmutable) |
| `fecha_termino` | LocalDateTime | SÍ | - | Cuándo se completó |

### Relaciones

- **N → 1 con Tickets:** Múltiples observaciones en un ticket
- **N → 1 con Categorias:** Clasificación de falla
- **1 → N con Evidencias:** Fotos/videos del problema
- **1 → N con Mensajes:** Chat sobre la observación
- **1 → N con HistorialBitacora:** Auditoría de cambios

### Enums

```java
public enum UrgenciaEnum {
    BAJA("baja"),
    MEDIA("media"),
    ALTA("alta");
}

public enum EstadoObservacionEnum {
    PENDIENTE("pendiente"),                   // Recién registrado
    EN_OBSERVACION("en observación"),         // Bajo análisis
    APLICA("aplica"),                         // Confirmado que aplica
    EN_PROCESO("en proceso"),                 // En reparación
    EN_ESPERA_ACEPTACION("en espera aceptación"), // Esperando cliente
    TERMINADO("terminado"),                   // Completado y aceptado
    NO_APLICA("no aplica");                   // Rechazado (requiere justificación)
}

public enum ConfirmacionClienteEnum {
    PENDIENTE("pendiente"),    // Enviado, esperando respuesta
    ACEPTADO("aceptado"),      // Cliente aprobó
    RECHAZADO("rechazado");    // Cliente rechazó
}
```

### Flujo Crítico

1. **Creación:** Cliente reporta problema → estado = PENDIENTE
2. **Análisis:** Admin revisa → estado = EN_OBSERVACION o APLICA
3. **Reparación:** Técnico ejecuta → estado = EN_PROCESO
4. **Cliente:** Se envía link (via `token_aceptacion`) → cliente confirma
5. **Cierre:** Si aprobado → TERMINADO; Si rechazado → vuelve a EN_PROCESO o NO_APLICA (con justificación)

---

## Evidencias

**Tabla:** `evidencias`  
**Propósito:** Almacena fotos/videos antes y después de cada reparación

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_evidencia` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_observacion` | Integer | NO | FK → observaciones | Observación asociada |
| `url_archivo` | String(500) | NO | - | URL en Google Cloud Storage |
| `tipo_archivo` | TipoArchivoEnum | NO | - | Tipo: IMAGEN, VIDEO |
| `momento` | MomentoEnum | NO | DEFAULT 'antes' | ANTES o DESPUES |
| `fecha_subida` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Cuándo se subió |

### Relaciones

- **N → 1 con Observaciones:** Múltiples evidencias por observación

### Enums

```java
public enum TipoArchivoEnum {
    IMAGEN("imagen"),
    VIDEO("video");
}

public enum MomentoEnum {
    ANTES("antes"),      // Estado inicial del problema
    DESPUES("despues");  // Estado después de reparación
}
```

### Propósito

Evidencia visual legal del estado del problema y su resolución. Se usa para auditoría y reclamaciones.

---

## Mensajes

**Tabla:** `mensajes`  
**Propósito:** Chat/bitácora de comunicación por observación

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_mensaje` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_observacion` | Integer | NO | FK → observaciones | Observación sobre la que se comenta |
| `id_usuario` | Integer | NO | FK → usuarios | Autor del mensaje |
| `mensaje` | Text | NO | - | Contenido del mensaje |
| `fecha_envio` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Cuándo se envió |

### Relaciones

- **N → 1 con Observaciones:** Múltiples mensajes por observación
- **N → 1 con Usuarios:** Autor del mensaje

### Propósito

Comunicación entre admin, técnicos y cliente sobre detalles específicos de cada reparación.

---

## HistorialBitacora

**Tabla:** `historial_bitacora`  
**Propósito:** CRÍTICA LEGAL - Registro inmutable de TODAS las acciones para auditoría y litigios

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_historial` | Integer | NO | PK, AUTO_INCREMENT | Identificador único |
| `id_observacion` | Integer | NO | FK → observaciones | Observación auditada |
| `id_usuario` | Integer | NO | FK → usuarios | Usuario que realizó la acción |
| `sello_tiempo` | LocalDateTime | NO | - | Timestamp exacto (inmodificable) |
| `accion` | String(255) | NO | - | Descripción: "Cambio de estado a Terminado" |
| `detalles` | Text | SÍ | - | Información adicional |
| `justificacion` | Text | SÍ | - | Obligatorio si estado = "No Aplica" |
| `fecha_creacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Cuándo se registró |

### Relaciones

- **N → 1 con Observaciones:** Múltiples registros por observación
- **N → 1 con Usuarios:** Autor de la acción

### Índices

```java
@Index(name = "idx_observacion", columnList = "id_observacion")
@Index(name = "idx_usuario", columnList = "id_usuario")
@Index(name = "idx_sello_tiempo", columnList = "sello_tiempo")
```

### Propósito

**"Escudo Legal" de Francisco Castillo**

- Registro inmutable de quién hizo qué y cuándo
- Exportable a Excel/PDF como prueba ante litigios
- Rastreo completo de cambios de estado
- Registro de correos automáticos enviados
- Cumple requerimiento legal para cobros de boletas de garantía (10% del contrato)

### Restricciones

- **NO se puede ACTUALIZAR:** Historial es de solo lectura
- **NO se puede ELIMINAR:** Permanencia legal garantizada
- Se registra automáticamente cada cambio de observación

---

## ObrasUsuarios

**Tabla:** `obras_usuarios`  
**Propósito:** Relación N:M que asigna trabajadores/usuarios a obras

### Campos

| Campo | Tipo | Nullable | Restricción | Descripción |
|-------|------|----------|-------------|-------------|
| `id_obra` | Integer | NO | PK, FK → obras | Primera parte de llave compuesta |
| `id_usuario` | Integer | NO | PK, FK → usuarios | Segunda parte de llave compuesta |
| `fecha_asignacion` | LocalDateTime | NO | DEFAULT CURRENT_TIMESTAMP | Cuándo se asignó |

### Relaciones

- **N → M con Obras:** Asignación flexible de múltiples usuarios a una obra
- **N → M con Usuarios:** Un usuario puede trabajar en múltiples obras

### Llave Primaria Compuesta

```java
@IdClass(ObrasUsuariosId.class)
public class ObrasUsuarios {
    @Id private Obras id_obra;
    @Id private Usuarios id_usuario;
}
```

### Propósito

Permite:
- Asignar múltiples técnicos a una obra
- Asignar admin/jefe_obra a múltiples obras
- Mantener flexibilidad sin romper restricción de "cliente" limitado a 1 obra

---

## 🔗 Diagrama de Relaciones

```
┌─────────────┐
│  Clientes   │
└──────┬──────┘
       │ (1→N)
       ▼
┌─────────────────────┐
│     Obras           │ ◄─────────────┐
├─────────────────────┤              │
│ id_obra (PK)        │          (N→M)
│ id_cliente (FK)     │              │
└──────┬──────────────┘              │
       │ (1→N)                        │
       ▼                              │
┌─────────────────────┐      ┌──────────────────┐
│    Tickets          │      │  Usuarios        │
├─────────────────────┤      ├──────────────────┤
│ id_ticket (PK)      │      │ id_usuario (PK)  │
│ id_obra (FK)        │      │ id_obra (FK-opt) │
│ id_usuario_creador  │      │ rol              │
└──────┬──────────────┘      └──────┬───────────┘
       │ (1→N)                       │ (1→N)
       ▼                             ▼
┌──────────────────────┐    ┌─────────────────┐
│  Observaciones       │    │ Mensajes        │
├──────────────────────┤    ├─────────────────┤
│ id_observacion (PK)  │    │ id_mensaje (PK) │
│ id_ticket (FK)       │◄───┤ id_observacion  │
│ id_categoria (FK)    │    │ id_usuario (FK) │
│ estado_observacion   │    └─────────────────┘
│ confirmacion_cliente │
│ token_aceptacion     │
└──────┬───────────────┘
       │ (1→N)
       ├─────────────────────┬──────────────────┐
       ▼                     ▼                  ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Evidencias      │ │ HistorialBitacora│ │  Categorias     │
├─────────────────┤ ├──────────────────┤ ├─────────────────┤
│ id_evidencia    │ │ id_historial (PK)│ │ id_categoria    │
│ url_archivo     │ │ id_observacion(FK)
│ tipo_archivo    │ │ id_usuario (FK)  │ │ nombre_categoria│
│ momento         │ │ sello_tiempo     │ │ subcategoria    │
└─────────────────┘ │ accion           │ └─────────────────┘
                    └──────────────────┘

N:M Relationship:
┌──────────────────────┐
│  ObrasUsuarios       │
├──────────────────────┤
│ id_obra (PK+FK)      │
│ id_usuario (PK+FK)   │
└──────────────────────┘
```

---

## 📊 Flujo Completo de una Observación

```
1. CLIENTE reporta problema
   ↓
2. Admin crea TICKET (agrupa todos los problemas de la obra)
   ↓
3. Admin crea OBSERVACIÓN(ES) dentro del ticket
   ├─ estado = PENDIENTE
   ├─ confirmacion_cliente = PENDIENTE
   ├─ Se registra en HISTORIAL_BITACORA
   
4. Admin/Técnico revisan
   ├─ Cambia estado a EN_OBSERVACION → Registra en HISTORIAL
   ├─ Sube foto ANTES → EVIDENCIA
   
5. Técnico ejecuta reparación
   ├─ Cambia estado a EN_PROCESO → Registra en HISTORIAL
   ├─ Envía MENSAJES con actualizaciones
   
6. Técnico sube evidencia DESPUÉS
   ├─ Cambia estado a EN_ESPERA_ACEPTACION
   ├─ Genera TOKEN y envía link al cliente
   
7. CLIENTE acepta/rechaza vía link
   ├─ Si ACEPTA → confirmacion_cliente = ACEPTADO
   │  └─ estado = TERMINADO → Registra en HISTORIAL
   │
   └─ Si RECHAZA → confirmacion_cliente = RECHAZADO
      └─ Vuelve a EN_PROCESO (ciclo 5-7)

TODO SE REGISTRA EN HISTORIAL_BITACORA (auditoría legal inmutable)
```

---

## 🔒 Consideraciones de Seguridad

1. **HistorialBitacora:** Inmutable (protección legal)
2. **Usuarios/Clientes:** Solo lectura en ciertos campos (fecha_creacion)
3. **Tokens:** Únicos por observación (seguridad en links)
4. **Roles:** Validación en backend (restrict roles per endpoint)
5. **Contraseñas:** Hash bcrypt (no almacenar plano)

---

## 🗂️ Estructura de Carpetas Backend

```
src/main/java/PitagoraBackend/
├── model/
│   ├── Clientes.java
│   ├── Usuarios.java
│   ├── Obras.java
│   ├── Categorias.java
│   ├── Tickets.java
│   ├── Observaciones.java
│   ├── Evidencias.java
│   ├── Mensajes.java
│   ├── HistorialBitacora.java
│   ├── ObrasUsuarios.java
│   └── ObrasUsuariosId.java
│
├── repository/
│   ├── ClientesRepository.java
│   ├── UsuariosRepository.java
│   ├── ObrasRepository.java
│   ├── CategoriasRepository.java
│   ├── TicketsRepository.java
│   ├── ObservacionesRepository.java
│   ├── EvidenciasRepository.java
│   ├── MensajesRepository.java
│   ├── HistorialBitacoraRepository.java
│   └── ObrasUsuariosRepository.java
│
├── service/
│   ├── ClientesService.java
│   ├── UsuariosService.java
│   ├── ObrasService.java
│   ├── CategoriasService.java
│   ├── TicketsService.java
│   ├── ObservacionesService.java
│   ├── EvidenciasService.java
│   ├── MensajesService.java
│   ├── HistorialBitacoraService.java
│   └── ObrasUsuariosService.java
│
└── controller/
    ├── ClientesController.java
    ├── UsuariosController.java
    ├── ObrasController.java
    ├── CategoriasController.java
    ├── TicketsController.java
    ├── ObservacionesController.java
    ├── EvidenciasController.java
    ├── MensajesController.java
    ├── HistorialBitacoraController.java
    └── ObrasUsuariosController.java
```

---

## 📝 Resumen

| Entidad | Tipo | Propósito | Restricciones |
|---------|------|----------|---|
| **Clientes** | Maestro | Empresas cliente | RUT único |
| **Usuarios** | Maestro | Autenticación | Correo único, restricción por rol |
| **Obras** | Transacción | Proyectos | 1:N con Clientes |
| **Categorias** | Maestro | Clasificación fallas | Predefinido |
| **Tickets** | Transacción | Contenedor de problemas | 1 ticket = múltiples problemas |
| **Observaciones** | Transacción | Unidad de trabajo | CRÍTICA, flujo multiestado |
| **Evidencias** | Transacción | Pruebas visuales | Antes/Después |
| **Mensajes** | Transacción | Comunicación | Chat por observación |
| **HistorialBitacora** | Auditoría | **LEGAL - Inmutable** | Solo lectura |
| **ObrasUsuarios** | Relacional | N:M Usuarios↔Obras | Llave compuesta |

