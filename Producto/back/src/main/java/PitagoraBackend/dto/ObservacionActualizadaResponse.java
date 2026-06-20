package PitagoraBackend.dto;

import PitagoraBackend.model.Observaciones;

public class ObservacionActualizadaResponse {
    private Observaciones observacion;
    private String advertenciaNotificacion;

    public ObservacionActualizadaResponse() {
    }

    public ObservacionActualizadaResponse(Observaciones observacion, String advertenciaNotificacion) {
        this.observacion = observacion;
        this.advertenciaNotificacion = advertenciaNotificacion;
    }

    public Observaciones getObservacion() {
        return observacion;
    }

    public void setObservacion(Observaciones observacion) {
        this.observacion = observacion;
    }

    public String getAdvertenciaNotificacion() {
        return advertenciaNotificacion;
    }

    public void setAdvertenciaNotificacion(String advertenciaNotificacion) {
        this.advertenciaNotificacion = advertenciaNotificacion;
    }
}
