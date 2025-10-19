package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.Actividad;
import java.time.format.DateTimeFormatter;

public class ActividadResponseDTO {
    private String usuario;
    private String accion;
    private String icono;
    private String fecha;

    public ActividadResponseDTO(Actividad actividad) {
        this.usuario = actividad.getUsuario();
        this.accion = actividad.getAccion();
        this.icono = actividad.getIcono();
        this.fecha = actividad.getFechaHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    // Getters
    public String getUsuario() {
        return usuario;
    }

    public String getAccion() {
        return accion;
    }

    public String getIcono() {
        return icono;
    }

    public String getFecha() {
        return fecha;
    }
}