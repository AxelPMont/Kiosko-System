package com.kiosko.kiosko_backend.dto;

import java.math.BigDecimal;

public class VentasPorCategoriaDTO {

    private String nombreCategoria;
    private double porcentaje;

    public VentasPorCategoriaDTO(String nombreCategoria, double porcentaje) {
        this.nombreCategoria = nombreCategoria;
        this.porcentaje = porcentaje;
    }

    // Getters y Setters
    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }
}
