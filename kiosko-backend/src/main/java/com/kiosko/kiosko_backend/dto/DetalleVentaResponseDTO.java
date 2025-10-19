package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.DetalleVenta;

import java.math.BigDecimal;

public class DetalleVentaResponseDTO {
    private String producto;
    private int cantidad;
    private BigDecimal subtotal;

    public DetalleVentaResponseDTO(DetalleVenta detalle) {
        this.producto = detalle.getProducto().getNombre();
        this.cantidad = detalle.getCantidad();
        this.subtotal = detalle.getSubtotal();
    }

    // Getters y Setters
    public String getProducto() { return producto; }
    public void setProducto(String producto) { this.producto = producto; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}