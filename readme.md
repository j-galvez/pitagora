# Pitágora

Aplicación web para centralizar y automatizar la gestión de postventa de la Constructora Pitágora. Organiza reclamos bajo un modelo de **tickets por obra**, con seguimiento de observaciones, evidencias, notificaciones y dashboard de estadísticas.

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Java 17, Spring Boot 3, Gradle |
| Frontend | React 19, Vite, Bootstrap |
| Base de datos | MySQL 8 |
| Cloud | Google Cloud (Cloud SQL, Cloud Storage) |

## Estructura del repositorio

```
pitagora/
├── Producto/
│   ├── back/          # API REST (Spring Boot)
│   └── front/         # Cliente web (React + Vite)
├── Documentación/     # Documentación del proyecto
├── Gestión/           # Planificación y gestión
└── sql_scripts/       # Scripts SQL adicionales en la raíz
```

## Requisitos previos

- **Java 17**
- **Node.js** (npm)
- **MySQL 8** (local o Cloud SQL)
- **Git**

Verificar instalación:

```bash
java -version
node -v
npm -v
```

## Configuración

### Base de datos

Los scripts de creación y datos de prueba están en `Producto/back/sql_scripts/`. Orden sugerido:

1. `01_create_tables.sql` — creación de tablas
2. `02_create_logic.sql` — lógica adicional
3. `03_seed_comunas_chile.sql` — datos de regiones/comunas (si aplica)
4. `03_insert_test_data.sql` — datos de prueba (opcional)

### Backend (`Producto/back/`)

Crear `src/main/resources/application.properties` (no se sube al repositorio). Ejemplo mínimo:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/pitagora
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD
spring.jpa.hibernate.ddl-auto=validate

# Google Cloud Storage (evidencias)
gcp.bucket.name=tu-bucket
gcp.config.path=file:./gcp-credentials.json

# Correo (opcional, para bienvenida y recuperación de contraseña)
spring.mail.host=smtp.tu-proveedor.com
spring.mail.port=587
spring.mail.username=tu-correo
spring.mail.password=tu-password
app.mail.from=noreply@pitagora.com
app.site.url=http://localhost:5173
```

Colocar las credenciales de GCP en `Producto/back/gcp-credentials.json` (también ignorado por Git).

### Frontend (`Producto/front/`)

El frontend consume la API en `http://localhost:8080/api`. No requiere archivo `.env` adicional para desarrollo local.

## Instalación

### Backend

```bash
cd Producto/back
./gradlew build
```

### Frontend

```bash
cd Producto/front
npm install
```

## Ejecución en local

Abrir **dos terminales**:

**Terminal 1 — API (puerto 8080):**

```bash
cd Producto/back
./gradlew bootRun
```

**Terminal 2 — Frontend (puerto 5173):**

```bash
cd Producto/front
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

## Scripts útiles

| Comando | Ubicación | Descripción |
|---------|-----------|-------------|
| `./gradlew bootRun` | `Producto/back` | Levantar API |
| `./gradlew test` | `Producto/back` | Ejecutar tests |
| `npm run dev` | `Producto/front` | Servidor de desarrollo |
| `npm run build` | `Producto/front` | Build de producción |
| `npm run lint` | `Producto/front` | Linter |

## Documentación adicional

- [`Producto/back/EJEMPLOS_API.md`](Producto/back/EJEMPLOS_API.md) — ejemplos de endpoints REST
- [`Producto/back/ENTIDADES_MODELO.md`](Producto/back/ENTIDADES_MODELO.md) — modelo de datos
- [`Producto/GCP_RECOMENDACIONES_DESPLIEGUE.md`](Producto/GCP_RECOMENDACIONES_DESPLIEGUE.md) — despliegue en Google Cloud
- [`Casos de uso.md`](Casos%20de%20uso.md) — estado de funcionalidades

## Funcionalidades principales

- Login y recuperación de contraseña
- Gestión de usuarios, clientes y obras
- Creación y seguimiento de tickets y observaciones
- Evidencias (almacenamiento en GCS)
- Mensajería y notificaciones por correo
- Dashboard y estadísticas
- Costos por observación

## Contribuir

1. Crear una rama desde `main`
2. Hacer los cambios y probar en local (backend + frontend)
3. Abrir un Pull Request con descripción clara del cambio

## Licencia

Proyecto privado — Constructora Pitágora. Consultar al equipo antes de redistribuir.
