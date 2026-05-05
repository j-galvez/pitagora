# 🔐 Tarea 1: Sistema de Autenticación

## 📋 Checklist General

- [ ] Actualizar esquema de base de datos
- [ ] Instalar dependencias necesarias
- [ ] Crear controladores de autenticación
- [ ] Crear rutas de API
- [ ] Actualizar componente Login
- [ ] Crear página de cambio de contraseña
- [ ] Implementar middleware de autenticación
- [ ] Probar flujo completo

---

## 1️⃣ Actualizar Base de Datos

### ✅ Tareas
- [ ] Modificar tabla `usuarios` en `database.sql`
- [ ] Ejecutar script de migración
- [ ] Verificar cambios en MySQL

### 📝 Código SQL

```sql
-- Actualizar tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN rut VARCHAR(12) UNIQUE AFTER correo,
ADD COLUMN password_hash VARCHAR(255) AFTER rut,
ADD COLUMN primera_vez BOOLEAN DEFAULT TRUE AFTER rol,
ADD COLUMN fecha_ultimo_cambio_password TIMESTAMP NULL AFTER fecha_registro;

-- Eliminar columna firebase_uid si existe
ALTER TABLE usuarios DROP COLUMN IF EXISTS firebase_uid;
```

### 🔧 Comandos
```bash
# Conectar a MySQL
mysql -u root -p

# Usar la base de datos
USE sistema_postventa_pitagora;

# Ejecutar el ALTER TABLE de arriba
```

### ⚠️ Consideraciones
- Hacer backup de la base de datos antes de modificar
- Si ya tienes usuarios, considera cómo migrar los datos existentes
- El campo `rut` debe ser único para evitar duplicados

---

## 2️⃣ Instalar Dependencias Backend

### ✅ Tareas
- [ ] Instalar bcrypt para hashear contraseñas
- [ ] Instalar jsonwebtoken para JWT
- [ ] Instalar nodemailer para envío de emails
- [ ] Instalar dotenv para variables de entorno

### 🔧 Comandos
```bash
cd Carpeta_Producto/back
npm install bcrypt jsonwebtoken nodemailer dotenv
```

### 📝 Crear archivo `.env`
```env
# Carpeta_Producto/back/.env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_postventa_pitagora
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion

# Configuración de email (ejemplo con Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
```

### ⚠️ Consideraciones
- Nunca subir el archivo `.env` a Git
- Agregar `.env` al `.gitignore`
- Usar contraseñas de aplicación para Gmail (no tu contraseña personal)

---

## 3️⃣ Crear Controlador de Autenticación

### ✅ Tareas
- [ ] Crear archivo `authController.js`
- [ ] Implementar función `login`
- [ ] Implementar función `cambiarPassword`
- [ ] Implementar función `crearUsuario` (para admin)

### 📝 Código: `Carpeta_Producto/back/controllers/authController.js`

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        email: usuario.correo, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Responder con token y datos del usuario
    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.correo,
        rol: usuario.rol,
        debe_cambiar_password: usuario.primera_vez
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CREAR USUARIO (Solo Admin)
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, rut, rol, telefono } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !rut) {
      return res.status(400).json({ error: 'Nombre, correo y RUT son requeridos' });
    }

    // Generar contraseña temporal desde RUT (sin puntos ni guión)
    const passwordTemporal = rut.replace(/[.-]/g, '');

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(passwordTemporal, 10);

    // Insertar usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, rut, password_hash, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, correo, rut, passwordHash, rol || 'Cliente', telefono]
    );

    // Enviar email con credenciales
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Bienvenido a PITAGORA - Credenciales de Acceso',
      html: `
        <h2>Bienvenido a PITAGORA</h2>
        <p>Hola ${nombre},</p>
        <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
        <ul>
          <li><strong>Email:</strong> ${correo}</li>
          <li><strong>Contraseña temporal:</strong> ${passwordTemporal}</li>
        </ul>
        <p><strong>IMPORTANTE:</strong> Por seguridad, deberás cambiar tu contraseña la primera vez que ingreses.</p>
        <p>Accede al sistema en: <a href="http://localhost:5173/login">http://localhost:5173/login</a></p>
      `
    });

    res.status(201).json({ 
      mensaje: 'Usuario creado exitosamente',
      id_usuario: result.insertId 
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar errores específicos
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo o RUT ya está registrado' });
    }
    
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CAMBIAR CONTRASEÑA
exports.cambiarPassword = async (req, res) => {
  try {
    const { password_actual, password_nueva } = req.body;
    const userId = req.user.id; // Del middleware de autenticación

    // Validar campos
    if (!password_actual || !password_nueva) {
      return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
    }

    // Validar longitud de nueva contraseña
    if (password_nueva.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    // Obtener usuario
    const [usuarios] = await db.query(
      'SELECT password_hash FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(
      password_actual,
      usuarios[0].password_hash
    );

    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const nuevoHash = await bcrypt.hash(password_nueva, 10);

    // Actualizar contraseña
    await db.query(
      'UPDATE usuarios SET password_hash = ?, primera_vez = FALSE, fecha_ultimo_cambio_password = NOW() WHERE id_usuario = ?',
      [nuevoHash, userId]
    );

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// VERIFICAR TOKEN (útil para validar sesión)
exports.verificarToken = async (req, res) => {
  try {
    // Si llegó aquí, el token es válido (verificado por middleware)
    const userId = req.user.id;

    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, correo, rol, primera_vez FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario: usuarios[0] });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
```

### ⚠️ Consideraciones
- Usar bcrypt con salt rounds de 10 (balance entre seguridad y rendimiento)
- Nunca devolver el password_hash en las respuestas
- Validar siempre los inputs del usuario
- Manejar errores específicos de MySQL (duplicados, etc.)

---

## 4️⃣ Crear Middleware de Autenticación

### ✅ Tareas
- [ ] Crear archivo `authMiddleware.js`
- [ ] Implementar verificación de JWT

### 📝 Código: `Carpeta_Producto/back/middleware/authMiddleware.js`

```javascript
const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
exports.verificarToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // El formato es: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar datos del usuario al request
    req.user = decoded;

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Error al verificar token' });
  }
};

// Middleware para verificar rol de admin
exports.verificarAdmin = (req, res, next) => {
  if (req.user.rol !== 'Admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  next();
};
```

---

## 5️⃣ Crear Rutas de Autenticación

### ✅ Tareas
- [ ] Crear archivo `authRoutes.js`
- [ ] Definir rutas públicas y protegidas
- [ ] Integrar con `index.js`

### 📝 Código: `Carpeta_Producto/back/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.post('/cambiar-password', verificarToken, authController.cambiarPassword);
router.get('/verificar', verificarToken, authController.verificarToken);

// Rutas de admin (requieren autenticación + rol admin)
router.post('/usuarios', verificarToken, verificarAdmin, authController.crearUsuario);

module.exports = router;
```

### 📝 Actualizar: `Carpeta_Producto/back/index.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API PITAGORA funcionando' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### 🔧 Comandos
```bash
# Instalar cors si no está instalado
npm install cors

# Iniciar servidor
npm start
```

---

## 6️⃣ Actualizar Frontend - Login

### ✅ Tareas
- [ ] Actualizar `login.jsx` con llamada real al backend
- [ ] Agregar manejo de errores
- [ ] Agregar estados de carga
- [ ] Implementar redirección según `debe_cambiar_password`

### 📝 Código: Actualizar `Carpeta_Producto/front/src/pages/login.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))

        // Redirigir según si debe cambiar contraseña
        if (data.usuario.debe_cambiar_password) {
          navigate('/cambiar-password')
        } else {
          navigate('/tickets')
        }
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="vh-100"
      style={{ background: 'linear-gradient(135deg, #003860 0%, #91ABC6 100%)' }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div
              className="card"
              style={{
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(0, 56, 96, 0.3)',
              }}
            >
              <div className="row g-0">
                <div
                  className="col-md-6 col-lg-5 d-none d-md-block"
                  style={{ backgroundColor: '#003860' }}
                >
                  <img
                    src="https://libertyfield.pe/wp-content/uploads/2022/10/adrian-cogua-zTqpgdzteyc-unsplash-scaled.jpg"
                    alt="PITAGORA Constructora"
                    className="img-fluid"
                    style={{
                      borderRadius: '1rem 0 0 1rem',
                      objectFit: 'cover',
                      height: '100%',
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center mb-4 pb-3 justify-content-center">
                        <img
                          src="https://www.pitagora.cl/images/logo_up_pitagora.gif"
                          alt="PITAGORA Logo"
                          style={{ maxHeight: '60px' }}
                        />
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3 text-center"
                        style={{
                          letterSpacing: '1px',
                          color: '#003860',
                        }}
                      >
                        Ingresa a tu cuenta
                      </h5>

                      {/* Mensaje de error */}
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          style={{
                            borderColor: '#003860',
                            color: '#003860',
                          }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <label
                          className="form-label"
                          htmlFor="form2Example17"
                          style={{ color: '#003860' }}
                        >
                          Correo electrónico
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          style={{
                            borderColor: '#003860',
                            color: '#003860',
                          }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <label
                          className="form-label"
                          htmlFor="form2Example27"
                          style={{ color: '#003860' }}
                        >
                          Contraseña
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-lg btn-block w-100"
                          type="submit"
                          style={{
                            backgroundColor: '#003860',
                            borderColor: '#003860',
                            color: 'white',
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                      </div>

                      <div className="text-center">
                        <a
                          className="small"
                          href="#!"
                          style={{
                            color: '#ED1C25',
                            textDecoration: 'none',
                          }}
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>

                      <div
                        className="text-center"
                        style={{
                          borderTop: '1px solid #91ABC6',
                          paddingTop: '1rem',
                        }}
                      >
                        <a
                          href="#!"
                          className="small"
                          style={{
                            color: '#91ABC6',
                            textDecoration: 'none',
                            marginRight: '1rem',
                          }}
                        >
                          Términos de uso
                        </a>
                        <a
                          href="#!"
                          className="small"
                          style={{
                            color: '#91ABC6',
                            textDecoration: 'none',
                          }}
                        >
                          Política de privacidad
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 7️⃣ Crear Página de Cambio de Contraseña

### ✅ Tareas
- [ ] Crear componente `CambiarPassword.jsx`
- [ ] Agregar ruta en `App.jsx`
- [ ] Implementar validación de contraseñas

### 📝 Código: `Carpeta_Producto/front/src/pages/CambiarPassword.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (passwordNueva !== passwordConfirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (passwordNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:3000/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password_actual: passwordActual,
          password_nueva: passwordNueva
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Contraseña actualizada exitosamente')
        navigate('/tickets')
      } else {
        setError(data.error || 'Error al cambiar contraseña')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="vh-100"
      style={{ background: 'linear-gradient(135deg, #003860 0%, #91ABC6 100%)' }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-8">
            <div
              className="card"
              style={{
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(0, 56, 96, 0.3)',
              }}
            >
              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-4 pb-3 justify-content-center">
                    <img
                      src="https://www.pitagora.cl/images/logo_up_pitagora.gif"
                      alt="PITAGORA Logo"
                      style={{ maxHeight: '60px' }}
                    />
                  </div>

                  <h5
                    className="fw-normal mb-3 pb-3 text-center"
                    style={{
                      letterSpacing: '1px',
                      color: '#003860',
                    }}
                  >
                    Cambiar Contraseña
                  </h5>

                  <div className="alert alert-info" role="alert">
                    Por seguridad, debes cambiar tu contraseña temporal.
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      style={{
                        borderColor: '#003860',
                        color: '#003860',
                      }}
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <label className="form-label" style={{ color: '#003860' }}>
                      Contraseña Actual (temporal)
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      style={{
                        borderColor: '#003860',
                        color: '#003860',
                      }}
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                    />
                    <label className="form-label" style={{ color: '#003860' }}>
                      Nueva Contraseña (mínimo 8 caracteres)
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      style={{
                        borderColor: '#003860',
                        color: '#003860',
                      }}
                      value={passwordConfirmar}
                      onChange={(e) => setPasswordConfirmar(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                    />
                    <label className="form-label" style={{ color: '#003860' }}>
                      Confirmar Nueva Contraseña
                    </label>
                  </div>

                  <div className="pt-1 mb-4">
                    <button
                      className="btn btn-lg btn-block w-100"
                      type="submit"
                      style={{
                        backgroundColor: '#003860',
                        borderColor: '#003860',
                        color: 'white',
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 📝 Actualizar: `Carpeta_Producto/front/src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CambiarPassword from './pages/CambiarPassword'
import Tickets from './pages/Tickets' // Asume que existe

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## 8️⃣ Probar el Sistema

### ✅ Checklist de Pruebas

- [ ] Backend responde en `http://localhost:3000`
- [ ] Frontend corre en `http://localhost:5173`
- [ ] Crear usuario desde Postman/Thunder Client
- [ ] Recibir email con credenciales
- [ ] Login con credenciales temporales
- [ ] Redirección a cambio de contraseña
- [ ] Cambiar contraseña exitosamente
- [ ] Login con nueva contraseña
- [ ] Acceso a /tickets

### 🔧 Comandos de Prueba

```bash
# Terminal 1 - Backend
cd Carpeta_Producto/back
npm start

# Terminal 2 - Frontend
cd Carpeta_Producto/front
npm run dev
```

### 📝 Prueba con Postman/Thunder Client

**1. Crear Usuario (como Admin):**
```
POST http://localhost:3000/api/auth/usuarios
Content-Type: application/json
Authorization: Bearer TU_TOKEN_DE_ADMIN

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "rut": "12345678-9",
  "rol": "Cliente",
  "telefono": "+56912345678"
}
```

**2. Login:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456789"
}
```

**3. Cambiar Contraseña:**
```
POST http://localhost:3000/api/auth/cambiar-password
Content-Type: application/json
Authorization: Bearer TOKEN_RECIBIDO_EN_LOGIN

{
  "password_actual": "123456789",
  "password_nueva": "MiNuevaPassword123"
}
```

---

## ✅ Checklist Final

- [ ] Base de datos actualizada
- [ ] Dependencias instaladas
- [ ] Archivo `.env` configurado
- [ ] Controladores creados
- [ ] Middleware implementado
- [ ] Rutas configuradas
- [ ] Login actualizado
- [ ] Página de cambio de contraseña creada
- [ ] Rutas del frontend configuradas
- [ ] Sistema probado end-to-end
- [ ] Emails funcionando

---

## 🎯 Próximos Pasos

Una vez completada esta tarea, continuar con:
- **[02_Base_Datos.md](02_Base_Datos.md)** - Optimizaciones adicionales
- **[03_Backend_API.md](03_Backend_API.md)** - Endpoints de tickets
- **[04_Frontend_Componentes.md](04_Frontend_Componentes.md)** - Componentes adicionales

---

**Última actualización:** 2026-04-16