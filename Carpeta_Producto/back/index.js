const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde cualquier origen (ideal para desarrollo local)
app.use(express.json());

// Rutas
app.use('/api/tickets', ticketRoutes);

// Endpoint de prueba de conexión
app.get('/api/test-db', async (req, res) => {
    const db = require('./config/db');
    try {
        const [rows] = await db.query('SELECT NOW() as fecha_servidor, DATABASE() as db_nombre');
        res.json({
            status: 'success',
            message: 'Conectado a Google Cloud SQL',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error de conexión a la base de datos',
            error: error.message
        });
    }
});

// El servidor corre en el puerto 3000, la DB en el 3306. No chocan.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Pitágora listo en http://localhost:${PORT}`);
});