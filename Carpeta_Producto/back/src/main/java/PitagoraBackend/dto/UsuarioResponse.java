package PitagoraBackend.dto;

public class UsuarioResponse {
    private Integer id_usuario;
    private String nombre;
    private String correo;
    private String rol;
    private String estado;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Integer id_usuario, String nombre, String correo, String rol, String estado) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.estado = estado;
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
}
