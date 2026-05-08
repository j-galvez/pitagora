package PitagoraBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalTickets;
    private Long ticketsAbiertos;
    private Long observacionesAbiertas;
    private Long observacionesAltaUrgencia;
}

