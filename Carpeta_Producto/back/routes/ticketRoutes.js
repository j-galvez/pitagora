const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Crear un ticket con su primera observación
router.post('/', ticketController.crearTicketCompleto);

// Obtener todos los tickets de una obra específica (para el dashboard)
router.get('/obra/:id_obra', ticketController.obtenerTicketsPorObra);

// Obtener tickets de una obra con usuario, observaciones y evidencias
router.get('/detalle/obra/:id_obra', ticketController.obtenerDetalleTicketsPorObra);

module.exports = router;