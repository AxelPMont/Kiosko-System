package com.kiosko.kiosko_backend.dto;

import java.time.LocalDate;

public class VentasSemanaDTO {

    private LocalDate fecha;
    private double total;

    public VentasSemanaDTO(LocalDate fecha, double total) {
        this.fecha = fecha;
        this.total = total;
    }

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