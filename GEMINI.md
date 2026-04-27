# Estado del Proyecto - Constructora Pitágora (Sesión 25-04-2026)

## 🎯 Objetivo Logrado
Se migró exitosamente al stack **Front2 (React + Vite + Tailwind)** conectado a un **Backend (Node.js + MySQL)** real. La base de datos local (XAMPP) ya refleja la estructura jerárquica de **Tickets > Observaciones**.

## 🛠️ Stack Tecnológico Actual
- **Frontend:** React + Vite + Tailwind (Carpeta `front2`).
- **Backend:** Express.js + MySQL2 + CORS.
- **Base de Datos:** MySQL local (XAMPP) -> Próxima migración a Google Cloud SQL.

## 📍 Puntos de Interés
- **API Base:** `http://localhost:3000/api`
- **Frontend Base:** `http://localhost:5173`
- **Base de Datos:** Se usa el esquema en `back/database/schema/01_create_tables.sql`.
- **Servicio de Red:** La lógica de conexión está en `front2/src/app/services/api.ts`.

## 🚀 Pendientes para la Próxima Sesión
1. **Autenticación Real:** Cambiar el mock de `Login.tsx` por una llamada al backend que valide contra la tabla `usuarios`.
2. **Creación de Tickets:** Implementar la lógica en el frontend para que el formulario de "Crear Ticket" use `ticketService.createTicket`.
3. **Dashboard Administrativo:** Conectar la vista de administrador para que liste todos los tickets de todas las obras.
4. **Gestión de Archivos:** Implementar la subida de imágenes/evidencias (actualmente solo texto).

## ⚠️ Notas de Configuración
- El proyecto en GitHub está actualizado al commit: `feat: integrar front2 con backend real y sincronizar base de datos`.
- Se ignora la carpeta "Carpeta Contexto" en el repo pero es vital para el análisis de requerimientos.
