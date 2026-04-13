# Pitagora

Proyecto base con arquitectura separada:

- Backend: Node.js + Express
- Frontend: React + Vite + Bootstrap

Actualmente el proyecto está en fase inicial (base creada, sin lógica de negocio implementada).

## Estructura actual

- `back/`: API con Express
- `front/`: Cliente web con React

## IMPORTANTE Requisitos previos

Antes de instalar dependencias, tener instalado:

- Node.js (recomendado: versión LTS) (descargar en pagina web oficial) https://nodejs.org/en/download
- npm (viene con Node.js)
- Git

Verificar instalación:

```bash
node -v
npm -v
git --version
```

## Instalar dependencias (las que no se suben a Git)

En este repositorio no se suben carpetas como `node_modules`, por eso hay que instalar dependencias en `back/` y `front/`.

### macOS / Linux

Desde la raíz del proyecto:

```bash
cd back
npm install

cd ../front
npm install
```

### Windows (PowerShell o CMD)

Desde la raíz del proyecto:

```bash
cd back
npm install

cd ..\front
npm install
```
## Crear .env para guardar credenciales
Las credenciales (contraseñas y api keys) por seguridad no se suben al repositorio.
En la carpeta /back viene un archivo .env de ejemplo con la estructura para pegar las credenciales.
Solo hay que reemplazar el nombre del archivo de ".env.ejemplo" a ".env"


## Estado de ejecución

- Frontend: ya incluye scripts de Vite (`npm run dev`, `npm run build`, `npm run preview`).
- Backend: aún no tiene scripts de ejecución definidos en `back/package.json` y todavía no hay archivo base de servidor creado.

Cuando se agregue el servidor de Express, se recomienda definir al menos un script `dev` en el backend para arrancarlo fácilmente.

## Dependencias actuales detectadas

Backend (`back/package.json`):

- express
- dotenv
- mysql2

Frontend (`front/package.json`):

- react
- react-dom
- bootstrap
- react-bootstrap
- vite (dev)
- eslint y plugins (dev)
