package PitagoraBackend.dto;

import java.time.LocalDateTime;

public class UsuarioResponse {
    private Integer id_usuario;
    private String nombre;
    private String correo;
    private String rol;
    private String estado;
    private LocalDateTime fecha_creacion;
    private Integer id_obra;
    private String nombre_obra;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Integer id_usuario, String nombre, String correo, String rol, String estado, LocalDateTime fecha_creacion, Integer id_obra, String nombre_obra) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.estado = estado;
        this.fecha_creacion = fecha_creacion;
        this.id_obra = id_obra;
        this.nombre_obra = nombre_obra;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(LocalDateTime fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public Integer getId_obra() {
        return id_obra;
    }

    public void setId_obra(Integer id_obra) {
        this.id_obra = id_obra;
    }

    public String getNombre_obra() {
        return nombre_obra;
    }

    public void setNombre_obra(String nombre_obra) {
        this.nombre_obra = nombre_obra;
    }
}
