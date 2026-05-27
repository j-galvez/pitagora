package PitagoraBackend.dto;

public class ResetPasswordRequest {
    private Integer idUsuario;
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public ResetPasswordRequest(Integer idUsuario, String newPassword) {
        this.idUsuario = idUsuario;
        this.newPassword = newPassword;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
