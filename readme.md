# Pitagora

El Proyecto Pitágora consiste en el desarrollo de una aplicación web responsiva, diseñada para centralizar y automatizar la gestión de postventa de la Constructora Pitágora. Este proyecto busca eliminar la vulnerabilidad legal y pérdida de información creando un canal único que estructure los reclamos bajo un modelo ordenado de "tickets por obra".

### Módulos en proceso de construcción
- Módulo Login.
- Módulo Evidencia y Notificaciones.
- Módulo de Obras/Proyectos.
- Módulos Tickets.
- Módulo Dashboard y Estadísticas.
- Módulo Integración IA.
- Módulo Respaldo y Respaldo Legal.

### Módulos terminados
- Módulo preparación.
- Módulo Base de Datos.

### Stack Tecnológico
Proyecto base con arquitectura separada:

- Backend: Java + Springboot
- Frontend: React + Bootstrap
- Cloud: Google Cloud -> Cloud SQL + Firebase Storage
- Base de Datos: MySQL
   
## Estructura actual

- `back/`: API con Springboot
- `front/`: Cliente web con React

## IMPORTANTE Requisitos previos

Antes de instalar dependencias, tener instalado:

- Java 17
- npm install
- Git

Verificar instalación:

```bash
npm -v
git --version
```

## Instalar dependencias (las que no se suben a Git)

En este repositorio hay que instalar dependencias en `back/` y `front/`.

### macOS / Linux

Desde la raíz del proyecto:

```bash
cd back
npm install

cd ../front
npm install
npm install bootstrap-icons
npm install react-icons --save
```

### Windows (PowerShell o CMD)

Desde la raíz del proyecto:

```bash
cd back
npm install

cd ..\front
npm install
npm install bootstrap-icons
npm install react-icons --save
```
## Crear .env para guardar credenciales
Las credenciales (contraseñas y api keys) por seguridad no se suben al repositorio.
En la carpeta /back viene un archivo .env de ejemplo con la estructura para pegar las credenciales.
Solo hay que reemplazar el nombre del archivo de ".env.ejemplo" a ".env"


## Estado de ejecución

- Frontend: ya incluye scripts de Vite (`npm run dev`, `npm run build`, `npm run preview`).
- Backend: aún no tiene scripts de ejecución definidos en `back/package.json` y todavía no hay archivo base de servidor creado.
        Se puede ejecutar en la terminal de '/back' con el comando /gradlew bootRun

Cuando se agregue el servidor de Express, se recomienda definir al menos un script `dev` en el backend para arrancarlo fácilmente.

## Dependencias actuales detectadas

## Dependencias Backend (Spring Boot) (`back/build.gradle`)

dependencies {

    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // DevTools
    developmentOnly 'org.springframework.boot:spring-boot-devtools'

    // MySQL Driver
    runtimeOnly 'com.mysql:mysql-connector-j'

    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testCompileOnly 'org.projectlombok:lombok'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    testAnnotationProcessor 'org.projectlombok:lombok'
}

## Dependencias Frontend (React + Vite)(`front/package.json`)

json {

    {
     "dependencies": {
       "bootstrap": "^5.3.8",
       "bootstrap-icons": "^1.13.1",
       "react": "^19.2.4",
       "react-bootstrap": "^2.10.10",
       "react-dom": "^19.2.4",
       "react-icons": "^5.6.0",
       "react-router-dom": "^7.14.1"
     },
     "devDependencies": {
       "@eslint/js": "^9.39.4",
       "@types/react": "^19.2.14",
       "@types/react-dom": "^19.2.3",
       "@vitejs/plugin-react": "^6.0.1",
       "eslint": "^9.39.4",
       "eslint-plugin-react-hooks": "^7.0.1",
       "eslint-plugin-react-refresh": "^0.5.2",
       "globals": "^17.4.0",
       "vite": "^8.0.4"
     }
   }
