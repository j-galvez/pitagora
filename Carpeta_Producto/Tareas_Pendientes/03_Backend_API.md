# 🔌 Tarea 3: Backend API Completo

## 📋 Checklist General

- [ ] Configurar estructura de carpetas
- [ ] Crear controladores de tickets
- [ ] Crear controladores de observaciones
- [ ] Crear controladores de obras y categorías
- [ ] Implementar subida de archivos (evidencias)
- [ ] Crear rutas protegidas
- [ ] Agregar validaciones
- [ ] Documentar API

---

## 1️⃣ Estructura de Carpetas Backend

### ✅ Tareas
- [ ] Organizar carpetas del proyecto
- [ ] Crear archivos base

### 📁 Estructura Recomendada

```
Carpeta_Producto/back/
├── config/
│   ├── db.js                 # Conexión a MySQL
│   └── multer.js             # Configuración de subida de archivos
├── controllers/
│   ├── authController.js     # ✅ Ya creado
│   ├── ticketController.js   # Gestión de tickets
│   ├── observacionController.js
│   ├── obraController.js
│   └── categoriaController.js
├── middleware/
│   ├── authMiddleware.js     # ✅ Ya creado
│   ├── validationMiddleware.js
│   └── uploadMiddleware.js
├── routes/
│   ├── authRoutes.js         # ✅ Ya creado
│   ├── ticketRoutes.js
│   ├── observacionRoutes.js
│   ├── obraRoutes.js
│   └── categoriaRoutes.js
├── utils/
│   ├── validators.js
│   └── helpers.js
├── .env
├── .gitignore
├── index.js
└── package.json
```

---

## 2️⃣ Controlador de Tickets

### ✅ Tareas
- [ ] Crear `ticketController.js`
- [ ] Implementar CRUD completo
- [ ] Agregar filtros y búsqueda

### 📝 Código: `Carpeta_Producto/back/controllers/ticketController.js`

```javascript
const db = require('../config/db');

// OBTENER TODOS LOS TICKETS (con filtros)
exports.obtenerTickets = async (req, res) => {
  try {
    const { estado, id_obra, id_usuario } = req.query;
    const userRole = req.user.rol;
    const userId = req.user.id;

    let query = `
      SELECT 
        t.id_ticket,
        t.estado_general,
        t.fecha_creacion,
        u.nombre AS nombre_usuario,
        u.correo AS correo_usuario,
        o.nombre_obra,
        COUNT(obs.id_observacion) AS total_observaciones,
        SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) AS observaciones_terminadas
      FROM tickets t
      INNER JOIN usuarios u ON t.id_usuario = u.id_usuario
      INNER JOIN obras o ON t.id_obra = o.id_obra
      LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket
      WHERE 1=1
    `;

    const params = [];

    // Si no es admin, solo ver sus propios tickets
    if (userRole !== 'Admin') {
      query += ' AND t.id_usuario = ?';
      params.push(userId);
    }

    // Filtros opcionales
    if (estado) {
      query += ' AND t.estado_general = ?';
      params.push(estado);
    }

    if (id_obra) {
      query += ' AND t.id_obra = ?';
      params.push(id_obra);
    }

    if (id_usuario && userRole === 'Admin') {
      query += ' AND t.id_usuario = ?';
      params.push(id_usuario);
    }

    query += ' GROUP BY t.id_ticket ORDER BY t.fecha_creacion DESC';

    const [tickets] = await db.query(query, params);

    res.json({ tickets });

  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// OBTENER UN TICKET POR ID
exports.obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.rol;
    const userId = req.user.id;

    // Obtener ticket
    const [tickets] = await db.query(
      `SELECT 
        t.*,
        u.nombre AS nombre_usuario,
        u.correo AS correo_usuario,
        u.telefono AS telefono_usuario,
        o.nombre_obra
      FROM tickets t
      INNER JOIN usuarios u ON t.id_usuario = u.id_usuario
      INNER JOIN obras o ON t.id_obra = o.id_obra
      WHERE t.id_ticket = ?`,
      [id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const ticket = tickets[0];

    // Verificar permisos
    if (userRole !== 'Admin' && ticket.id_usuario !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver este ticket' });
    }

    // Obtener observaciones del ticket
    const [observaciones] = await db.query(
      `SELECT 
        obs.*,
        c.nombre_categoria,
        COUNT(e.id_evidencia) AS total_evidencias
      FROM observaciones obs
      INNER JOIN categorias c ON obs.id_categoria = c.id_categoria
      LEFT JOIN evidencias e ON obs.id_observacion = e.id_observacion
      WHERE obs.id_ticket = ?
      GROUP BY obs.id_observacion
      ORDER BY obs.fecha_registro DESC`,
      [id]
    );

    res.json({
      ticket,
      observaciones
    });

  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CREAR TICKET
exports.crearTicket = async (req, res) => {
  try {
    const { id_obra, observaciones } = req.body;
    const id_usuario = req.user.id;

    // Validaciones
    if (!id_obra || !observaciones || observaciones.length === 0) {
      return res.status(400).json({ 
        error: 'Obra y al menos una observación son requeridas' 
      });
    }

    // Iniciar transacción
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Crear ticket
      const [ticketResult] = await connection.query(
        'INSERT INTO tickets (id_usuario, id_obra, estado_general) VALUES (?, ?, ?)',
        [id_usuario, id_obra, 'Abierto']
      );

      const id_ticket = ticketResult.insertId;

      // Insertar observaciones
      for (const obs of observaciones) {
        await connection.query(
          `INSERT INTO observaciones 
          (id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, fecha_hallazgo) 
          VALUES (?, ?, ?, ?, ?)`,
          [
            id_ticket,
            obs.id_categoria,
            obs.ubicacion_exacta,
            obs.descripcion_problema,
            obs.fecha_hallazgo || new Date()
          ]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        mensaje: 'Ticket creado exitosamente',
        id_ticket
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ACTUALIZAR ESTADO DE TICKET
exports.actualizarEstadoTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_general } = req.body;
    const userRole = req.user.rol;

    // Solo admin puede cambiar estado manualmente
    if (userRole !== 'Admin') {
      return res.status(403).json({ 
        error: 'Solo administradores pueden cambiar el estado del ticket' 
      });
    }

    // Validar estado
    const estadosValidos = ['Abierto', 'Cerrado'];
    if (!estadosValidos.includes(estado_general)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [result] = await db.query(
      'UPDATE tickets SET estado_general = ? WHERE id_ticket = ?',
      [estado_general, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json({ mensaje: 'Estado actualizado exitosamente' });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ELIMINAR TICKET (solo admin)
exports.eliminarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ 
        error: 'Solo administradores pueden eliminar tickets' 
      });
    }

    const [result] = await db.query(
      'DELETE FROM tickets WHERE id_ticket = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json({ mensaje: 'Ticket eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// OBTENER ESTADÍSTICAS
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const userRole = req.user.rol;
    const userId = req.user.id;

    let whereClause = '';
    const params = [];

    if (userRole !== 'Admin') {
      whereClause = 'WHERE t.id_usuario = ?';
      params.push(userId);
    }

    const [stats] = await db.query(`
      SELECT 
        COUNT(DISTINCT t.id_ticket) AS total_tickets,
        COUNT(DISTINCT CASE WHEN t.estado_general = 'Abierto' THEN t.id_ticket END) AS tickets_abiertos,
        COUNT(DISTINCT CASE WHEN t.estado_general = 'Cerrado' THEN t.id_ticket END) AS tickets_cerrados,
        COUNT(obs.id_observacion) AS total_observaciones,
        SUM(CASE WHEN obs.estado_observacion = 'Nuevo' THEN 1 ELSE 0 END) AS observaciones_nuevas,
        SUM(CASE WHEN obs.estado_observacion = 'En proceso' THEN 1 ELSE 0 END) AS observaciones_en_proceso,
        SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) AS observaciones_terminadas,
        SUM(CASE WHEN obs.estado_observacion = 'No aplica' THEN 1 ELSE 0 END) AS observaciones_no_aplica
      FROM tickets t
      LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket
      ${whereClause}
    `, params);

    res.json(stats[0]);

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
```

---

## 3️⃣ Controlador de Observaciones

### ✅ Tareas
- [ ] Crear `observacionController.js`
- [ ] Implementar actualización de estado
- [ ] Gestionar evidencias

### 📝 Código: `Carpeta_Producto/back/controllers/observacionController.js`

```javascript
const db = require('../config/db');

// OBTENER OBSERVACIONES DE UN TICKET
exports.obtenerObservaciones = async (req, res) => {
  try {
    const { id_ticket } = req.params;

    const [observaciones] = await db.query(
      `SELECT 
        obs.*,
        c.nombre_categoria
      FROM observaciones obs
      INNER JOIN categorias c ON obs.id_categoria = c.id_categoria
      WHERE obs.id_ticket = ?
      ORDER BY obs.fecha_registro DESC`,
      [id_ticket]
    );

    res.json({ observaciones });

  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// OBTENER UNA OBSERVACIÓN CON EVIDENCIAS
exports.obtenerObservacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [observaciones] = await db.query(
      `SELECT 
        obs.*,
        c.nombre_categoria,
        t.id_ticket,
        t.estado_general,
        o.nombre_obra
      FROM observaciones obs
      INNER JOIN categorias c ON obs.id_categoria = c.id_categoria
      INNER JOIN tickets t ON obs.id_ticket = t.id_ticket
      INNER JOIN obras o ON t.id_obra = o.id_obra
      WHERE obs.id_observacion = ?`,
      [id]
    );

    if (observaciones.length === 0) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    // Obtener evidencias
    const [evidencias] = await db.query(
      'SELECT * FROM evidencias WHERE id_observacion = ? ORDER BY fecha_subida DESC',
      [id]
    );

    res.json({
      observacion: observaciones[0],
      evidencias
    });

  } catch (error) {
    console.error('Error al obtener observación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CREAR OBSERVACIÓN
exports.crearObservacion = async (req, res) => {
  try {
    const { id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, fecha_hallazgo } = req.body;

    // Validaciones
    if (!id_ticket || !id_categoria || !ubicacion_exacta || !descripcion_problema) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [result] = await db.query(
      `INSERT INTO observaciones 
      (id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, fecha_hallazgo) 
      VALUES (?, ?, ?, ?, ?)`,
      [id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, fecha_hallazgo || new Date()]
    );

    res.status(201).json({
      mensaje: 'Observación creada exitosamente',
      id_observacion: result.insertId
    });

  } catch (error) {
    console.error('Error al crear observación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ACTUALIZAR ESTADO DE OBSERVACIÓN
exports.actualizarEstadoObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_observacion } = req.body;
    const userRole = req.user.rol;

    // Solo admin puede cambiar estado
    if (userRole !== 'Admin') {
      return res.status(403).json({ 
        error: 'Solo administradores pueden cambiar el estado' 
      });
    }

    // Validar estado
    const estadosValidos = ['Nuevo', 'En proceso', 'Terminado', 'No aplica'];
    if (!estadosValidos.includes(estado_observacion)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [result] = await db.query(
      'UPDATE observaciones SET estado_observacion = ? WHERE id_observacion = ?',
      [estado_observacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    res.json({ mensaje: 'Estado actualizado exitosamente' });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ACTUALIZAR OBSERVACIÓN
exports.actualizarObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { ubicacion_exacta, descripcion_problema, id_categoria } = req.body;

    const updates = [];
    const params = [];

    if (ubicacion_exacta) {
      updates.push('ubicacion_exacta = ?');
      params.push(ubicacion_exacta);
    }

    if (descripcion_problema) {
      updates.push('descripcion_problema = ?');
      params.push(descripcion_problema);
    }

    if (id_categoria) {
      updates.push('id_categoria = ?');
      params.push(id_categoria);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE observaciones SET ${updates.join(', ')} WHERE id_observacion = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    res.json({ mensaje: 'Observación actualizada exitosamente' });

  } catch (error) {
    console.error('Error al actualizar observación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ELIMINAR OBSERVACIÓN
exports.eliminarObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ 
        error: 'Solo administradores pueden eliminar observaciones' 
      });
    }

    const [result] = await db.query(
      'DELETE FROM observaciones WHERE id_observacion = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }

    res.json({ mensaje: 'Observación eliminada exitosamente' });

  } catch (error) {
    console.error('Error al eliminar observación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// AGREGAR EVIDENCIA
exports.agregarEvidencia = async (req, res) => {
  try {
    const { id_observacion } = req.params;
    const { url_archivo } = req.body;

    if (!url_archivo) {
      return res.status(400).json({ error: 'URL del archivo es requerida' });
    }

    const [result] = await db.query(
      'INSERT INTO evidencias (id_observacion, url_archivo) VALUES (?, ?)',
      [id_observacion, url_archivo]
    );

    res.status(201).json({
      mensaje: 'Evidencia agregada exitosamente',
      id_evidencia: result.insertId
    });

  } catch (error) {
    console.error('Error al agregar evidencia:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ELIMINAR EVIDENCIA
exports.eliminarEvidencia = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM evidencias WHERE id_evidencia = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }

    res.json({ mensaje: 'Evidencia eliminada exitosamente' });

  } catch (error) {
    console.error('Error al eliminar evidencia:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
```

---

## 4️⃣ Controladores de Obras y Categorías

### 📝 Código: `Carpeta_Producto/back/controllers/obraController.js`

```javascript
const db = require('../config/db');

// OBTENER TODAS LAS OBRAS
exports.obtenerObras = async (req, res) => {
  try {
    const { activas } = req.query;

    let query = 'SELECT * FROM obras';
    const params = [];

    if (activas === 'true') {
      query += ' WHERE estado_obra = TRUE';
    }

    query += ' ORDER BY nombre_obra ASC';

    const [obras] = await db.query(query, params);

    res.json({ obras });

  } catch (error) {
    console.error('Error al obtener obras:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CREAR OBRA (solo admin)
exports.crearObra = async (req, res) => {
  try {
    const { nombre_obra } = req.body;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear obras' });
    }

    if (!nombre_obra) {
      return res.status(400).json({ error: 'Nombre de obra es requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO obras (nombre_obra) VALUES (?)',
      [nombre_obra]
    );

    res.status(201).json({
      mensaje: 'Obra creada exitosamente',
      id_obra: result.insertId
    });

  } catch (error) {
    console.error('Error al crear obra:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ACTUALIZAR OBRA
exports.actualizarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_obra, estado_obra } = req.body;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ error: 'Solo administradores pueden actualizar obras' });
    }

    const updates = [];
    const params = [];

    if (nombre_obra !== undefined) {
      updates.push('nombre_obra = ?');
      params.push(nombre_obra);
    }

    if (estado_obra !== undefined) {
      updates.push('estado_obra = ?');
      params.push(estado_obra);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE obras SET ${updates.join(', ')} WHERE id_obra = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }

    res.json({ mensaje: 'Obra actualizada exitosamente' });

  } catch (error) {
    console.error('Error al actualizar obra:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
```

### 📝 Código: `Carpeta_Producto/back/controllers/categoriaController.js`

```javascript
const db = require('../config/db');

// OBTENER TODAS LAS CATEGORÍAS
exports.obtenerCategorias = async (req, res) => {
  try {
    const { activas } = req.query;

    let query = 'SELECT * FROM categorias';

    if (activas === 'true') {
      query += ' WHERE estado_categoria = TRUE';
    }

    query += ' ORDER BY nombre_categoria ASC';

    const [categorias] = await db.query(query);

    res.json({ categorias });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CREAR CATEGORÍA (solo admin)
exports.crearCategoria = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear categorías' });
    }

    if (!nombre_categoria) {
      return res.status(400).json({ error: 'Nombre de categoría es requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO categorias (nombre_categoria) VALUES (?)',
      [nombre_categoria]
    );

    res.status(201).json({
      mensaje: 'Categoría creada exitosamente',
      id_categoria: result.insertId
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ACTUALIZAR CATEGORÍA
exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria, estado_categoria } = req.body;
    const userRole = req.user.rol;

    if (userRole !== 'Admin') {
      return res.status(403).json({ error: 'Solo administradores pueden actualizar categorías' });
    }

    const updates = [];
    const params = [];

    if (nombre_categoria !== undefined) {
      updates.push('nombre_categoria = ?');
      params.push(nombre_categoria);
    }

    if (estado_categoria !== undefined) {
      updates.push('estado_categoria = ?');
      params.push(estado_categoria);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE categorias SET ${updates.join(', ')} WHERE id_categoria = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría actualizada exitosamente' });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
```

---

## 5️⃣ Rutas Completas

### 📝 Código: `Carpeta_Producto/back/routes/ticketRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas de tickets
router.get('/', ticketController.obtenerTickets);
router.get('/estadisticas', ticketController.obtenerEstadisticas);
router.get('/:id', ticketController.obtenerTicketPorId);
router.post('/', ticketController.crearTicket);
router.patch('/:id/estado', verificarAdmin, ticketController.actualizarEstadoTicket);
router.delete('/:id', verificarAdmin, ticketController.eliminarTicket);

module.exports = router;
```

### 📝 Código: `Carpeta_Producto/back/routes/observacionRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/ticket/:id_ticket', observacionController.obtenerObservaciones);
router.get('/:id', observacionController.obtenerObservacionPorId);
router.post('/', observacionController.crearObservacion);
router.put('/:id', verificarAdmin, observacionController.actualizarObservacion);
router.patch('/:id/estado', verificarAdmin, observacionController.actualizarEstadoObservacion);
router.delete('/:id', verificarAdmin, observacionController.eliminarObservacion);

// Evidencias
router.post('/:id_observacion/evidencias', observacionController.agregarEvidencia);
router.delete('/evidencias/:id', observacionController.eliminarEvidencia);

module.exports = router;
```

### 📝 Código: `Carpeta_Producto/back/routes/obraRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const obraController = require('../controllers/obraController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', obraController.obtenerObras);
router.post('/', verificarAdmin, obraController.crearObra);
router.put('/:id', verificarAdmin, obraController.actualizarObra);

module.exports = router;
```

### 📝 Código: `Carpeta_Producto/back/routes/categoriaRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', categoriaController.obtenerCategorias);
router.post('/', verificarAdmin, categoriaController.crearCategoria);
router.put('/:id', verificarAdmin, categoriaController.actualizarCategoria);

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
const observacionRoutes = require('./routes/observacionRoutes');
const obraRoutes = require('./routes/obraRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/observaciones', observacionRoutes);
app.use('/api/obras', obraRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API PITAGORA funcionando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tickets: '/api/tickets',
      observaciones: '/api/observaciones',
      obras: '/api/obras',
      categorias: '/api/categorias'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
```

---

## ✅ Checklist Final

- [ ] Todos los controladores creados
- [ ] Todas las rutas configuradas
- [ ] Middleware de autenticación funcionando
- [ ] Validaciones implementadas
- [ ] Permisos por rol configurados
- [ ] API probada con Postman/Thunder Client
- [ ] Documentación de endpoints lista

---

## 🎯 Próximos Pasos

Continuar con:
- **[04_Frontend_Componentes.md](04_Frontend_Componentes.md)** - Componentes del frontend

---

**Última actualización:** 2026-04-16