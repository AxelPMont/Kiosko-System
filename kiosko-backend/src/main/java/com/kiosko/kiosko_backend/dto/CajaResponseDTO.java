package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.Caja;
import com.kiosko.kiosko_backend.model.Caja.Estado;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CajaResponseDTO {

    private Long idCaja;
    private LocalDateTime fechaApertura;
    private LocalDateTime fechaCierre;
    private BigDecimal montoApertura;
    private BigDecimal montoCierre;
    private Estado estado;
    private String nombreUsuario;

    public CajaResponseDTO(Caja caja) {
        this.idCaja = caja.getIdCaja();
        this.fechaApertura = caja.getFechaApertura();
        this.fechaCierre = caja.getFechaCierre();
        this.montoApertura = caja.getMontoApertura();
        this.montoCierre = caja.getMontoCierre();
        this.estado = caja.getEstado();
        this.nombreUsuario = caja.getUsuario().getNombreUsuario();
    }

    //Getters
    public Long getIdCaja() {
        return idCaja;
    }
    public LocalDateTime getFechaApertura() {
        return fechaApertura;
    }
    public LocalDateTime getFechaCierre() {
        return fechaCierre;
    }
    public BigDecimal getMontoApertura() {
        return montoApertura;
    }
    public BigDecimal getMontoCierre() {
        return montoCierre;
    }
    public Estado getEstado() {
        return estado;
    }
    public String getNombreUsuario() {
        return nombreUsuario;
    }
}
