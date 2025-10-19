package com.kiosko.kiosko_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


public class VentasPorDiaDTO {
    private LocalDate fecha;
    private double total;

    public VentasPorDiaDTO(LocalDate fecha, double total) {
        this.fecha = fecha;
        this.total = total;
    }

    // Getters y Setters
    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}