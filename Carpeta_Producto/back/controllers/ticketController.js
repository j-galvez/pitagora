const db = require('../config/db');

// Crear un ticket con su primera observación (Transaccional)
exports.crearTicketCompleto = async (req, res) => {
    const { id_usuario_creador, id_obra, id_categoria, falla, ubicacion_exacta, descripcion_problema, urgencia } = req.body;
    
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertamos el Ticket (El contenedor)
        const [resTicket] = await connection.execute(
            'INSERT INTO tickets (id_obra, id_usuario_creador) VALUES (?, ?)',
            [id_obra, id_usuario_creador]
        );
        const idTicket = resTicket.insertId;

        // 2. Insertamos la primera Observación ligada a ese Ticket
        await connection.execute(
            'INSERT INTO observaciones (id_ticket, id_categoria, falla, ubicacion_exacta, descripcion_problema, urgencia) VALUES (?, ?, ?, ?, ?, ?)',
            [idTicket, id_categoria, falla, ubicacion_exacta, descripcion_problema, urgencia || 'media']
        );

        await connection.commit();
        
        res.status(201).json({ 
            success: true, 
            message: "Ticket y observación creados exitosamente", 
            id_ticket: idTicket 
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error en DB:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
};

// Obtener todos los tickets de una obra con sus detalles (Para el Dashboard)
exports.obtenerDetalleTicketsPorObra = async (req, res) => {
    const { id_obra } = req.params;

    try {
        // 1. Obtener los tickets base
        const [tickets] = await db.execute(
            `SELECT 
                t.id_ticket, 
                t.id_obra, 
                t.estado_general, 
                t.fecha_creacion,
                o.nombre_obra,
                o.descripcion_obra
            FROM tickets t
            JOIN obras o ON t.id_obra = o.id_obra
            WHERE t.id_obra = ?
            ORDER BY t.fecha_creacion DESC`,
            [id_obra]
        );

        if (tickets.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // 2. Obtener TODAS las observaciones de esos tickets
        const ticketIds = tickets.map(t => t.id_ticket);
        const placeholders = ticketIds.map(() => '?').join(',');

        const [observaciones] = await db.execute(
            `SELECT 
                obs.*, 
                cat.nombre_categoria 
            FROM observaciones obs
            JOIN categorias cat ON obs.id_categoria = cat.id_categoria
            WHERE obs.id_ticket IN (${placeholders})`,
            ticketIds
        );

        // 3. Obtener evidencias y mensajes (opcional para velocidad, pero lo incluimos)
        // Por ahora, agruparemos las observaciones dentro de sus tickets
        const ticketsConDetalle = tickets.map(ticket => {
            return {
                ...ticket,
                observaciones: observaciones
                    .filter(obs => obs.id_ticket === ticket.id_ticket)
                    .map(obs => ({
                        id: obs.id_observacion,
                        falla: obs.falla,
                        ubicacion: obs.ubicacion_exacta,
                        descripcion: obs.descripcion_problema,
                        estado: obs.estado_observacion,
                        urgencia: obs.urgencia,
                        categoria: obs.nombre_categoria,
                        fecha: obs.fecha_registro
                    }))
            };
        });

        res.json({ success: true, data: ticketsConDetalle });

    } catch (error) {
        console.error("Error al obtener detalles:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener un solo ticket con todo su historial de mensajes y fotos (Para la vista de detalle)
exports.obtenerTicketPorId = async (req, res) => {
    const { id_ticket } = req.params;
    // ... implementación similar pero más profunda ...
};
