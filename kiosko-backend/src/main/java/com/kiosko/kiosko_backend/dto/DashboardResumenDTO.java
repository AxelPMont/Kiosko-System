package com.kiosko.kiosko_backend.dto;

public class DashboardResumenDTO {

    private double ventasHoy;
    private double variacionVsAyer; // porcentaje
    private long totalProductos;
    private long productosBajoStock;
    private long totalUsuarios;
    private long administradores;
    private long alertas;

    public DashboardResumenDTO() {}

    public DashboardResumenDTO(double ventasHoy, double variacionVsAyer, long totalProductos,
                               long productosBajoStock, long totalUsuarios, long administradores, long alertas) {
        this.ventasHoy = ventasHoy;
        this.variacionVsAyer = variacionVsAyer;
        this.totalProductos = totalProductos;
        this.productosBajoStock = productosBajoStock;
        this.totalUsuarios = totalUsuarios;
        this.administradores = administradores;
        this.alertas = alertas;
    }

    // Getters y Setters
    public double getVentasHoy() {
        return ventasHoy;
    }

    public void setVentasHoy(double ventasHoy) {
        this.ventasHoy = ventasHoy;
    }

    public double getVariacionVsAyer() {
        return variacionVsAyer;
    }

    public void setVariacionVsAyer(double variacionVsAyer) {
        this.variacionVsAyer = variacionVsAyer;
    }

    public long getTotalProductos() {
        return totalProductos;
    }

    public void setTotalProductos(long totalProductos) {
        this.totalProductos = totalProductos;
    }

    public long getProductosBajoStock() {
        return productosBajoStock;
    }

    public void setProductosBajoStock(long productosBajoStock) {
        this.productosBajoStock = productosBajoStock;
    }

    public long getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(long totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    public long getAdministradores() {
        return administradores;
    }

    public void setAdministradores(long administradores) {
        this.administradores = administradores;
    }

    public long getAlertas() {
        return alertas;
    }

    public void setAlertas(long alertas) {
        this.alertas = alertas;
    }
}