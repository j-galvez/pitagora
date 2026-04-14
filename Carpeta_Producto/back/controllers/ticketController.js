const db = require('../config/db');

exports.crearTicketCompleto = async (req, res) => {
    const { id_usuario, id_obra, id_categoria, ubicacion, descripcion } = req.body;
    
    // Obtenemos una conexión específica para la transacción
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertamos el Ticket (El contenedor)
        const [resTicket] = await connection.execute(
            'INSERT INTO tickets (id_usuario, id_obra) VALUES (?, ?)',
            [id_usuario, id_obra]
        );
        const idTicket = resTicket.insertId;

        // 2. Insertamos la primera Observación ligada a ese Ticket
        await connection.execute(
            'INSERT INTO observaciones (id_ticket, id_categoria, ubicacion_exacta, descripcion_problema) VALUES (?, ?, ?, ?)',
            [idTicket, id_categoria, ubicacion, descripcion]
        );

        // Si todo salió bien, guardamos en la nube
        await connection.commit();
        
        res.status(201).json({ 
            success: true, 
            message: "Ticket y observación creados", 
            id_ticket: idTicket 
        });

    } catch (error) {
        // Si algo falla, deshacemos todo para no dejar tickets vacíos
        await connection.rollback();
        console.error("Error en DB:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        // Siempre liberar la conexión al pool
        connection.release();
    }
};

// Agregar esto al final de controllers/ticketController.js
exports.obtenerTicketsPorObra = async (req, res) => {
    const { id_obra } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM tickets WHERE id_obra = ?', [id_obra]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.obtenerDetalleTicketsPorObra = async (req, res) => {
    const { id_obra } = req.params;

    try {
        const [tickets] = await db.execute(
            `SELECT
                t.id_ticket,
                t.estado_general,
                t.fecha_creacion,
                u.id_usuario,
                u.nombre AS nombre_usuario,
                u.correo,
                o.id_obra,
                o.nombre_obra
            FROM tickets t
            INNER JOIN usuarios u ON u.id_usuario = t.id_usuario
            INNER JOIN obras o ON o.id_obra = t.id_obra
            WHERE t.id_obra = ?
            ORDER BY t.fecha_creacion DESC`,
            [id_obra]
        );

        if (tickets.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const ticketIds = tickets.map((ticket) => ticket.id_ticket);
        const placeholders = ticketIds.map(() => '?').join(',');

        const [observacionesRows] = await db.execute(
            `SELECT
                ob.id_observacion,
                ob.id_ticket,
                ob.ubicacion_exacta,
                ob.descripcion_problema,
                ob.estado_observacion,
                ob.fecha_hallazgo,
                ob.fecha_registro,
                c.id_categoria,
                c.nombre_categoria,
                ev.id_evidencia,
                ev.url_archivo,
                ev.fecha_subida
            FROM observaciones ob
            INNER JOIN categorias c ON c.id_categoria = ob.id_categoria
            LEFT JOIN evidencias ev ON ev.id_observacion = ob.id_observacion
            WHERE ob.id_ticket IN (${placeholders})
            ORDER BY ob.fecha_registro DESC, ev.fecha_subida DESC`,
            ticketIds
        );

        const observacionMap = new Map();

        observacionesRows.forEach((row) => {
            if (!observacionMap.has(row.id_observacion)) {
                observacionMap.set(row.id_observacion, {
                    id_observacion: row.id_observacion,
                    id_ticket: row.id_ticket,
                    ubicacion_exacta: row.ubicacion_exacta,
                    descripcion_problema: row.descripcion_problema,
                    estado_observacion: row.estado_observacion,
                    fecha_hallazgo: row.fecha_hallazgo,
                    fecha_registro: row.fecha_registro,
                    categoria: {
                        id_categoria: row.id_categoria,
                        nombre_categoria: row.nombre_categoria
                    },
                    evidencias: []
                });
            }

            if (row.id_evidencia) {
                observacionMap.get(row.id_observacion).evidencias.push({
                    id_evidencia: row.id_evidencia,
                    url_archivo: row.url_archivo,
                    fecha_subida: row.fecha_subida
                });
            }
        });

        const ticketsConDetalle = tickets.map((ticket) => ({
            ...ticket,
            observaciones: Array.from(observacionMap.values()).filter(
                (observacion) => observacion.id_ticket === ticket.id_ticket
            )
        }));

        res.json({ success: true, data: ticketsConDetalle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};