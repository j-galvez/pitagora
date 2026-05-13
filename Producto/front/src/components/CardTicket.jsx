import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardTicket({ ticket }) {
  const navigate = useNavigate();

  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'abierto': return { backgroundColor: '#FFC107', color: '#000000' };
      case 'en proceso': return { backgroundColor: '#003860', color: '#FFFFFF' };
      case 'terminado': return { backgroundColor: '#28A745', color: '#FFFFFF' };
      default: return { backgroundColor: '#91ABC6', color: '#FFFFFF' };
    }
  };

  return (
    <div className="card mb-4 shadow-sm h-100 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title text-primary mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
            Ticket #{ticket.idTicket || ticket.id_ticket}
          </h5>
          <span className="badge rounded-pill px-3 py-2" style={getStatusStyle(ticket.estadoGeneral || ticket.estado_general)}>
            {ticket.estadoGeneral || ticket.estado_general}
          </span>
        </div>

        <h6 className="text-secondary small">Obra</h6>
        <p className="mb-2">{ticket.nombre_obra || ticket.obra?.nombre_obra || `ID Obra: ${ticket.idObra || ticket.id_obra}`}</p>

        <h6 className="text-secondary small mt-3">Fecha de Creación</h6>
        <p className="mb-3">{new Date(ticket.fechaCreacion || ticket.fecha_creacion).toLocaleDateString()}</p>

        <button 
          className="btn btn-sm w-100 mt-2 text-white" 
          style={{ backgroundColor: '#003860' }}
          onClick={() => navigate(`/crear-observacion/${ticket.idTicket || ticket.id_ticket}`)}
        >
          Ver Detalle de Observaciones
        </button>
      </div>
    </div>
  );
}