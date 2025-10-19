package com.kiosko.kiosko_backend.dto;

import java.util.List;

public class ReporteVentasDTO {

    private List<VentasPorDiaDTO> ventasPorDia;
    private List<TopProductoDTO> topProductos;
    private List<VentasPorCategoriaDTO> ventasPorCategoria;
    private double totalVentas;
    private long totalTransacciones;
    private double ticketPromedio;

    // Getters y Setters
    public List<VentasPorDiaDTO> getVentasPorDia() {
        return ventasPorDia;
    }

    public void setVentasPorDia(List<VentasPorDiaDTO> ventasPorDia) {
        this.ventasPorDia = ventasPorDia;
    }

    public List<TopProductoDTO> getTopProductos() {
        return topProductos;
    }

    public void setTopProductos(List<TopProductoDTO> topProductos) {
        this.topProductos = topProductos;
    }

    public List<VentasPorCategoriaDTO> getVentasPorCategoria() {
        return ventasPorCategoria;
    }

    public void setVentasPorCategoria(List<VentasPorCategoriaDTO> ventasPorCategoria) {
        this.ventasPorCategoria = ventasPorCategoria;
    }

    public double getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(double totalVentas) {
        this.totalVentas = totalVentas;
    }

    public long getTotalTransacciones() {
        return totalTransacciones;
    }

    public void setTotalTransacciones(long totalTransacciones) {
        this.totalTransacciones = totalTransacciones;
    }

    public double getTicketPromedio() {
        return ticketPromedio;
    }

    public void setTicketPromedio(double ticketPromedio) {
        this.ticketPromedio = ticketPromedio;
    }
}