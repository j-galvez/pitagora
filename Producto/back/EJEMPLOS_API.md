# 📚 Ejemplos de API - Sistema Pitágora

Ejemplos de JSON para crear Obras y Tickets mediante la API REST.

---

## 🏗️ Crear una Obra

### Endpoint
```
POST http://localhost:8080/api/obras
Content-Type: application/json
```

### JSON Completo
```json
{
  "id_cliente": 1,
  "nombre_obra": "Edificio Los Robles - Depto 301",
  "descripcion_obra": "Departamento ubicado en tercer piso, sector oriente",
  "direccion": "Av. Providencia 1234, Santiago",
  "planos_presupuestos": "https://storage.googleapis.com/pitagora/planos/obra-123.pdf",
  "fecha_entrega": "2026-03-15",
  "garantia_expira": "2029-03-15",
  "estado_obra": "Activa"
}
```

### JSON Mínimo (Solo campos obligatorios)
```json
{
  "id_cliente": 1,
  "nombre_obra": "Edificio Los Robles - Depto 301"
}
```

### Respuesta Exitosa (200 OK)
```json
{
  "id_obra": 5,
  "id_cliente": 1,
  "nombre_obra": "Edificio Los Robles - Depto 301",
  "descripcion_obra": "Departamento ubicado en tercer piso, sector oriente",
  "direccion": "Av. Providencia 1234, Santiago",
  "planos_presupuestos": "https://storage.googleapis.com/pitagora/planos/obra-123.pdf",
  "fecha_entrega": "2026-03-15",
  "garantia_expira": "2029-03-15",
  "estado_obra": "Activa",
  "fecha_creacion": "2026-05-04T00:45:00"
}
```

### Campos
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_cliente` | Integer | ✅ Sí | ID del cliente (empresa) |
| `nombre_obra` | String | ✅ Sí | Nombre de la obra/proyecto |
| `descripcion_obra` | String | ❌ No | Descripción detallada |
| `direccion` | String | ❌ No | Dirección física |
| `planos_presupuestos` | String | ❌ No | URL a documentos |
| `fecha_entrega` | Date | ❌ No | Formato: YYYY-MM-DD |
| `garantia_expira` | Date | ❌ No | Formato: YYYY-MM-DD |
| `estado_obra` | String | ❌ No | "Activa" (default), "Garantía Vencida", "Cerrada" |

---

## 🎫 Crear un Ticket

### Endpoint
```
POST http://localhost:8080/api/tickets
Content-Type: application/json
```

### JSON Completo
```json
{
  "id_obra": 5,
  "id_usuario_creador": 2,
  "estado_general": "abierto"
}
```

### JSON Mínimo (Solo campos obligatorios)
```json
{
  "id_obra": 5,
  "id_usuario_creador": 2
}
```

### Respuesta Exitosa (200 OK)
```json
{
  "id_ticket": 123,
  "id_obra": 5,
  "id_usuario_creador": 2,
  "fecha_creacion": "2026-05-04T00:45:30",
  "estado_general": "abierto"
}
```

### Campos
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_obra` | Integer | ✅ Sí | ID de la obra (debe existir) |
| `id_usuario_creador` | Integer | ✅ Sí | ID del usuario que crea el ticket |
| `estado_general` | String | ❌ No | "abierto" (default), "en proceso", "terminado" |

---

## 🔄 Flujo Completo de Ejemplo

### 1. Crear una Obra
```bash
POST /api/obras
```
```json
{
  "id_cliente": 1,
  "nombre_obra": "Casa Los Pinos"
}
```
**Respuesta:** `{ "id_obra": 5, ... }`

### 2. Crear un Ticket para esa Obra
```bash
POST /api/tickets
```
```json
{
  "id_obra": 5,
  "id_usuario_creador": 2
}
```
**Respuesta:** `{ "id_ticket": 123, ... }`

### 3. Agregar Observaciones al Ticket
```bash
POST /api/tickets/123/observaciones
```
*(Próximo paso - aún no implementado)*

---

## ❌ Errores Comunes

### Error: Obra no existe
**Request:**
```json
{
  "id_obra": 999,
  "id_usuario_creador": 2
}
```
**Respuesta (400 Bad Request):**
```
La obra no existe con ID: 999
```

### Error: Usuario no existe
**Request:**
```json
{
  "id_obra": 5,
  "id_usuario_creador": 999
}
```
**Respuesta (400 Bad Request):**
```
El usuario creador no existe con ID: 999
```

### Error: Estado inválido
**Request:**
```json
{
  "id_obra": 5,
  "id_usuario_creador": 2,
  "estado_general": "pendiente"
}
```
**Respuesta (400 Bad Request):**
```
Estado inválido. Debe ser: 'abierto', 'en proceso' o 'terminado'
```

---

## 📋 Otros Endpoints Disponibles

### Obras
- `GET /api/obras` - Listar todas las obras
- `GET /api/obras/{id_obra}` - Obtener obra por ID
- `PUT /api/obras/{id_obra}` - Actualizar obra
- `DELETE /api/obras/{id_obra}` - Eliminar obra

### Tickets
- `GET /api/tickets` - Listar todos los tickets
- `GET /api/tickets/{id_ticket}` - Obtener ticket por ID
- `PUT /api/tickets/{id_ticket}` - Actualizar ticket
- `DELETE /api/tickets/{id_ticket}` - Eliminar ticket

### Usuarios
- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/{id_usuario}` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id_usuario}` - Actualizar usuario
- `DELETE /api/usuarios/{id_usuario}` - Eliminar usuario
- `POST /api/usuarios/login` - Autenticar usuario

---

## 🔧 Configuración

**Base URL:** `http://localhost:8080`

**Headers requeridos:**
```
Content-Type: application/json
```

**CORS:** Habilitado para todos los orígenes (`*`)