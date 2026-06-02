# Recomendaciones para desplegar Pitágora en Google Cloud

Documento orientado a **levantar la app en GCP** y a **preparar una presentación** del proyecto. Solo recomendaciones; sin pasos de implementación ni código.

---

## 1. Lo que ya tienes

| Componente | Estado |
|-----------|--------|
| **Cloud SQL (MySQL)** | Instancia `db-f1-micro` en Santiago (`southamerica-west1`) |
| **Base de datos** | Modelo y datos exportados / scripts en el repo |
| **Backend** | Spring Boot 3 + JPA, API REST, correo, subida de archivos |
| **Frontend** | React + Vite, build estático |
| **Almacenamiento previsto** | Google Cloud Storage (dependencia y servicio de imágenes ya contemplados en el backend) |

Con Cloud SQL resuelves la capa de datos. Para que la app sea usable desde internet faltan **hosting del backend**, **hosting del frontend**, **conectividad segura a la BD**, **secretos**, **archivos** y **correo**.

---

## 2. Arquitectura recomendada (demo y presentación)

Para un proyecto académico / MVP de postventa, la opción más equilibrada en GCP es:

```
Usuario → HTTPS
    ├── Frontend (estático)     → Firebase Hosting  o  Cloud Storage + CDN
    └── API Spring Boot         → Cloud Run (misma región: Santiago)
            ├── Cloud SQL       → conector / IP privada (ya la tienes)
            ├── Cloud Storage   → bucket para evidencias y planos
            └── SMTP / correo   → Gmail, SendGrid o similar (vía variables/Secret Manager)
```

### Por qué esta combinación

- **Cloud Run**: encaja bien con Spring Boot empaquetado en contenedor; HTTPS incluido; escala a cero (bajo costo en demo); sin administrar VMs.
- **Firebase Hosting o Storage+CDN**: el frontend de Vite es solo archivos estáticos; despliegue simple y URL pública para la presentación.
- **Mantener Cloud SQL** en la misma región reduce latencia y simplifica la facturación y el discurso en la presentación (“todo en Chile”).

### Alternativas (cuándo considerarlas)

| Opción | Ventaja | Desventaja para Pitágora |
|--------|---------|---------------------------|
| **Compute Engine (VM)** | Control total, familiar | Más mantenimiento, siempre encendida = más costo |
| **App Engine** | Integración GCP clásica | Menos flexible que Run para contenedores Spring |
| **GKE (Kubernetes)** | Escala enterprise | Complejidad excesiva para presentación/MVP |
| **Un solo Cloud Run sirviendo API + estáticos** | Un solo servicio | Mezcla responsabilidades; menos limpio para explicar capas |

Para la presentación, **separar frontend y backend** ayuda a explicar la arquitectura del README (cliente web + API + BD + storage).

---

## 3. Qué más necesitas en GCP (checklist)

### 3.1 Cuenta y proyecto

- Proyecto GCP dedicado (ej. `pitagora-prod` o `pitagora-demo`).
- **Facturación activada** (Cloud Run y tráfico saliente pueden generar cargo aunque sea bajo).
- APIs habituales a habilitar: Cloud Run, Cloud Build, Artifact Registry, Secret Manager, Cloud Storage, Cloud SQL Admin (ya usas SQL).

### 3.2 Backend (API Spring Boot)

- **Imagen de contenedor** del backend (Docker) subida a **Artifact Registry**.
- **Servicio Cloud Run** en `southamerica-west1`, con:
  - Variables de entorno para JDBC (host, usuario, BD, contraseña).
  - Puerto que espere Spring (típicamente 8080).
  - Memoria/CPU mínimos para demo (ej. 512 MiB–1 GiB).
- **Conexión a Cloud SQL** sin exponer la BD a internet:
  - Opción recomendada: **Cloud SQL Auth Proxy / conector de Cloud Run** (no abrir IP pública de MySQL si puedes evitarlo).
- **Cuenta de servicio** de Cloud Run con permisos mínimos: acceso a Cloud SQL, lectura/escritura en el bucket de Storage.

### 3.3 Frontend (React)

- Build de producción (`npm run build`) con **URL de la API de producción** (hoy el proyecto apunta a `localhost:8080` en muchos sitios; en cloud debe ser la URL de Cloud Run).
- Hosting en **Firebase Hosting** (rápido, SSL, buen storytelling en presentación) **o** bucket público + **Cloud CDN** / Load Balancer (más “puro GCP”).
- Dominio opcional: subdominio en **Cloud DNS** o dominio de Firebase.

### 3.4 Cloud Storage (archivos)

- **Bucket** en la misma región (ej. `pitagora-evidencias` o similar).
- Política de acceso acorde al uso: URLs públicas para lectura de evidencias vs objetos privados + URLs firmadas (más seguro; mejor argumento en presentación).
- En producción, **no depender de un JSON de cuenta de servicio en el repo**: usar la identidad de la cuenta de servicio de Cloud Run (Workload Identity / credenciales por defecto).

### 3.5 Secretos y configuración

- **Secret Manager** (recomendado) para:
  - Contraseña de Cloud SQL.
  - Credenciales SMTP (recuperación de contraseña, bienvenida).
  - Cualquier clave futura (JWT, etc.).
- El `application.properties` no debe versionarse con secretos (ya está en `.gitignore`; mantener esa práctica en cloud).

### 3.6 Correo (Spring Mail)

- El backend ya usa **JavaMailSender** y enlaces con `app.site.url` (hoy orientado a localhost del front).
- Necesitas un **proveedor SMTP real** en producción (Gmail con contraseña de aplicación, SendGrid, Mailgun, etc.).
- Actualizar conceptualmente: **URL del sitio en producción** para que los mails de recuperación apunten al front desplegado, no a `localhost:5173`.

### 3.7 Red y seguridad

- **CORS**: hoy solo permite orígenes locales; en producción debes **añadir la URL del frontend desplegado** (y quitar o limitar localhost en prod).
- **HTTPS**: lo dan Cloud Run y Firebase Hosting; no servir la app en HTTP plano.
- **Firewall de Cloud SQL**: si usas IP pública, restringir solo a Cloud Run / tu IP; preferir conector privado.
- **IAM**: principio de mínimo privilegio en cuentas de servicio.

### 3.8 Observabilidad (opcional pero valioso en la presentación)

- **Cloud Logging** (logs de Cloud Run integrados).
- **Cloud Monitoring** o alertas básicas (errores 5xx, latencia).
- Mencionar en la slide de “operación” aunque no lo configures al 100%.

---

## 4. Ajustes conceptuales en la aplicación (sin entrar en código)

Antes o durante el despliegue, conviene tener claro que el repo aún está en modo desarrollo local:

| Tema | Situación actual | Recomendación |
|------|------------------|---------------|
| URL de la API en el front | Muchas referencias a `localhost:8080` | Una variable de entorno de build (ej. Vite) con la URL de Cloud Run |
| CORS | Solo localhost | Incluir dominio de producción del front |
| Autenticación | Sesión en `localStorage` | Aceptable para demo; en producción real planear JWT/refresh y HTTPS estricto |
| Storage | Credenciales por archivo JSON | Identidad de Cloud Run + bucket IAM |
| Emails | Depende de SMTP configurado | Probar flujo recuperar contraseña en entorno cloud |
| `db-f1-micro` | Suficiente para demo | Limitaciones de CPU/RAM/conexiones; no para muchos usuarios concurrentes |

Para la **presentación**, puedes mostrar el diagrama “como quedará” y una demo en cloud aunque algunos módulos (IA, respaldo legal) sigan en roadmap del README.

---

## 5. Orden sugerido de trabajo

1. Verificar que Cloud SQL tiene el esquema y datos necesarios (migraciones/scripts ya aplicados).
2. Crear bucket de Storage y definir política de acceso.
3. Contenedorizar backend y desplegar en Cloud Run con conexión a Cloud SQL y secretos.
4. Probar API con Postman o `curl` contra la URL de Run (login, tickets, dashboard).
5. Build del front con URL de API de producción y desplegar en Firebase Hosting o Storage+CDN.
6. Ajustar CORS y `app.site.url` / SMTP; probar recuperación de contraseña.
7. Prueba end-to-end: login → crear ticket → subir evidencia → dashboard.
8. Preparar slides con diagrama, costos estimados y decisiones (por qué Run, por qué Santiago, por qué SQL + Storage separados).

---

## 6. Costos orientativos (demo / presentación)

Valores aproximados; revisar [calculadora de precios GCP](https://cloud.google.com/products/calculator).

| Recurso | Nota |
|---------|------|
| **Cloud SQL db-f1-micro** | Ya lo pagas; ~USD 7–15/mes según almacenamiento y backups |
| **Cloud Run** | Muy bajo con poco tráfico; puede haber capa gratuita |
| **Cloud Storage** | Centavos con pocas evidencias |
| **Firebase Hosting** | Plan gratuito suele alcanzar para demo |
| **Egress (salida de datos)** | Cuidado si sirves muchas imágenes grandes |
| **Secret Manager** | Costo negligible con pocos secretos |

Para la presentación: mencionar **costo controlado en MVP** vs **escalado futuro** (instancia SQL más grande, más instancias Run, CDN).

---

## 7. Qué mostrar en la presentación del proyecto

### Slides útiles

1. **Problema de negocio**: postventa, tickets por obra, trazabilidad legal.
2. **Arquitectura lógica**: React → API → MySQL + Storage + Email.
3. **Arquitectura en GCP**: diagrama con región Santiago, Cloud SQL, Run, Hosting, bucket.
4. **Stack** (del README): Java 17, Spring Boot, React, MySQL, GCP.
5. **Módulos**: terminados (BD, preparación) vs en curso (login, evidencias, dashboard, IA).
6. **Demo en vivo**: URL pública del front + un flujo corto (login admin → listar tickets → dashboard).
7. **Seguridad y buenas prácticas**: secretos fuera del repo, HTTPS, CORS, SQL no expuesto.
8. **Roadmap cloud**: backups automáticos SQL, CI/CD con Cloud Build, dominio propio, autenticación JWT.

### Riesgos a mencionar con honestidad (suma credibilidad)

- Instancia `f1-micro` no es para producción con mucha carga.
- `localStorage` para sesión es temporal para MVP.
- Subida de archivos y correo deben probarse explícitamente en cloud.
- Backups y recuperación ante desastres (módulo “Respaldo legal” del README) aún como mejora futura.

---

## 8. Firebase Storage vs Cloud Storage

El README menciona **Firebase Storage**; el backend ya está alineado con **Google Cloud Storage** (SDK `google-cloud-storage`). Recomendación:

- **Usar un solo enfoque en la narrativa**: Cloud Storage nativo en GCP, mismo ecosistema que Run y SQL.
- Firebase Storage es compatible en infraestructura, pero añade otra consola y modelo mental si no usas Firebase Auth. Para Pitágora, **Cloud Storage + cuenta de servicio de Run** es más coherente.

---

## 9. CI/CD (opcional para la entrega)

No es obligatorio para la primera demo, pero queda bien en la presentación:

- **Cloud Build** conectado al repositorio Git: push → build imagen → deploy Run → build front → deploy Hosting.
- Entornos separados: `demo` vs `prod` (dos servicios Run o dos proyectos GCP).

---

## 10. Resumen ejecutivo

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Qué falta además de Cloud SQL? | Hosting API (Cloud Run), hosting front (Firebase Hosting o Storage+CDN), bucket GCS, secretos, SMTP, conexión segura SQL–Run, CORS y URLs de producción |
| ¿Qué recomiendo? | Cloud Run + Firebase Hosting (o Storage+CDN) + mismo proyecto/región Santiago + Secret Manager + no exponer MySQL |
| ¿La micro actual alcanza? | Sí para presentación y pruebas; planificar upgrade si hay más usuarios |
| ¿Prioridad antes de la presentación? | API en Run conectada a SQL → front con URL de API real → un flujo demo probado de punta a punta |

---

## 11. Referencias útiles (documentación Google)

- [Cloud Run – descripción general](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Conectar Cloud Run a Cloud SQL](https://cloud.google.com/sql/docs/mysql/connect-run)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Cloud Storage – mejores prácticas de seguridad](https://cloud.google.com/storage/docs/best-practices)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Regiones GCP – Santiago (`southamerica-west1`)](https://cloud.google.com/about/locations)

---

*Documento generado para el proyecto Pitágora — Constructora Pitágora, gestión de postventa por tickets.*
