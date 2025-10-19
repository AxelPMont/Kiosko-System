package com.kiosko.kiosko_backend.dto;

public class LoginResponseDTO {

    private Long idUsuario;
    private String nombreUsuario;
    private String nombreCompleto;
    private String rol;
    private String token;

    public LoginResponseDTO(Long idUsuario, String nombreUsuario, String nombreCompleto, String rol, String token) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
        this.token = token;
    }

    // Getters
    public Long getIdUsuario() {
        return idUsuario;
    }
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    public String getRol() {
        return rol;
    }
    public String getToken() {
        return token;
    }
}
