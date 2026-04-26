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

// El servidor corre en el puerto 3000, la DB en el 3306. No chocan.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Pitágora listo en http://localhost:${PORT}`);
});