const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Crear un ticket con su primera observación
// POST http://localhost:3000/api/tickets
router.post('/', ticketController.crearTicketCompleto);

// Obtener tickets de una obra con sus observaciones (Para el Dashboard)
// GET http://localhost:3000/api/tickets/obra/:id_obra/detalle
router.get('/obra/:id_obra/detalle', ticketController.obtenerDetalleTicketsPorObra);

// Obtener un ticket específico por ID
// GET http://localhost:3000/api/tickets/:id_ticket
router.get('/:id_ticket', ticketController.obtenerTicketPorId);

module.exports = router;
