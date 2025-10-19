package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.model.Usuario.Estado;
import com.kiosko.kiosko_backend.model.Usuario.Rol;

public class UsuarioResponseDTO {

    private Long idUsuario;
    private String nombreUsuario;
    private String nombreCompleto;
    private Rol rol;
    private Estado estado;

    public UsuarioResponseDTO(Usuario usuario) {
        this.idUsuario = usuario.getIdUsuario();
        this.nombreUsuario = usuario.getNombreUsuario();
        this.nombreCompleto = usuario.getNombreCompleto();
        this.rol = usuario.getRol();
        this.estado = usuario.getEstado();
    }

    //Getters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public Usuario.Rol getRol() {
        return rol;
    }

    public Estado getEstado() {
        return estado;
    }
}