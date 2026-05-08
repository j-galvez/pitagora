# Protección de Rutas - Documentación

## ¿Qué es la protección de rutas?

La protección de rutas es un mecanismo de seguridad que controla el acceso a diferentes páginas de la aplicación según:
1. Si el usuario está autenticado (logueado)
2. El rol del usuario (admin o cliente)

## Cómo funciona

### Componente ProtectedRoute

El componente `ProtectedRoute.jsx` actúa como un "guardián" que:

1. **Verifica autenticación**: Revisa si existe un usuario en `localStorage`
   - Si NO hay usuario → Redirige a `/login`
   
2. **Verifica rol**: Si se especifica un `requiredRole`, verifica que coincida
   - Si el rol no coincide → Redirige al dashboard correspondiente
   
3. **Permite acceso**: Si todo está correcto, muestra la página solicitada

### Tipos de rutas

#### 1. Rutas Públicas (sin protección)
```javascript
<Route path="/login" element={<Login />} />
```
- Cualquiera puede acceder
- No requiere autenticación

#### 2. Rutas de Admin (requiredRole="admin")
```javascript
<Route path="/admin-dashboard" element={
  <ProtectedRoute requiredRole="admin">
    <IndexAdmin />
  </ProtectedRoute>
} />
```
- Solo usuarios con `rol: 'admin'` pueden acceder
- Si un cliente intenta acceder → Redirige a `/dashboard`
- Si no está logueado → Redirige a `/login`

#### 3. Rutas de Cliente (requiredRole="cliente")
```javascript
<Route path="/dashboard" element={
  <ProtectedRoute requiredRole="cliente">
    <IndexUsuario />
  </ProtectedRoute>
} />
```
- Solo usuarios con `rol: 'cliente'` pueden acceder
- Si un admin intenta acceder → Redirige a `/admin-dashboard`
- Si no está logueado → Redirige a `/login`

#### 4. Rutas Compartidas (sin requiredRole)
```javascript
<Route path="/crear-ticket" element={
  <ProtectedRoute>
    <CrearTicket />
  </ProtectedRoute>
} />
```
- Cualquier usuario autenticado puede acceder
- Tanto admin como cliente tienen acceso
- Si no está logueado → Redirige a `/login`

## Flujo de autenticación

```
Usuario intenta acceder a /admin/usuarios
         ↓
¿Hay usuario en localStorage?
         ↓
    NO → Redirige a /login
    SÍ → ¿Tiene rol 'admin'?
              ↓
         NO → Redirige a /dashboard (su dashboard)
         SÍ → Muestra la página
```

## Ejemplo de uso

### Escenario 1: Usuario no logueado
```
Intenta: /admin-dashboard
Resultado: Redirige a /login
```

### Escenario 2: Cliente intenta acceder a ruta de admin
```
Usuario: { rol: 'cliente' }
Intenta: /admin/usuarios
Resultado: Redirige a /dashboard
```

### Escenario 3: Admin intenta acceder a ruta de cliente
```
Usuario: { rol: 'admin' }
Intenta: /dashboard
Resultado: Redirige a /admin-dashboard
```

### Escenario 4: Usuario correcto
```
Usuario: { rol: 'admin' }
Intenta: /admin-dashboard
Resultado: Muestra la página ✓
```

## Cómo probar

### Para probar como Admin:
1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
localStorage.setItem('usuario', JSON.stringify({
  id_usuario: 1,
  nombre: 'Admin Test',
  rol: 'admin'
}));
```
3. Recarga la página
4. Ahora puedes acceder a rutas de admin

### Para probar como Cliente:
```javascript
localStorage.setItem('usuario', JSON.stringify({
  id_usuario: 2,
  nombre: 'Cliente Test',
  rol: 'cliente',
  id_obra: 1
}));
```

### Para cerrar sesión:
```javascript
localStorage.removeItem('usuario');
```

## Rutas protegidas en la aplicación

### Solo Admin:
- `/admin-dashboard` - Dashboard del administrador
- `/admin/usuarios` - Gestión de usuarios
- `/admin/crear-usuarios` - Crear nuevo usuario
- `/admin/usuarios/:id` - Editar usuario
- `/admin/crear-cliente` - Crear cliente
- `/admin/crear-obra` - Crear obra

### Solo Cliente:
- `/dashboard` - Dashboard del cliente

### Compartidas (requiere login):
- `/crear-ticket` - Crear ticket
- `/crear-observacion` - Crear observación
- `/crear-observacion/:id_ticket` - Crear observación para ticket específico

### Públicas:
- `/` - Login
- `/login` - Login
- `/formulario-test` - Formulario de prueba (desarrollo)

## Ventajas de este sistema

1. **Seguridad**: Previene acceso no autorizado
2. **Experiencia de usuario**: Redirige automáticamente al lugar correcto
3. **Mantenible**: Fácil agregar nuevas rutas protegidas
4. **Flexible**: Permite rutas compartidas entre roles
5. **Simple**: Código claro y fácil de entender

## Próximos pasos recomendados

1. **Implementar login real**: Conectar con el backend para autenticación
2. **Tokens JWT**: Usar tokens en lugar de localStorage directo
3. **Refresh tokens**: Mantener sesión activa
4. **Timeout de sesión**: Cerrar sesión automáticamente después de inactividad
5. **Permisos granulares**: Agregar más niveles de permisos si es necesario