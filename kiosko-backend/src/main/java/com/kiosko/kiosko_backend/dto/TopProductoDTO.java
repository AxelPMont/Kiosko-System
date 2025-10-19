package com.kiosko.kiosko_backend.dto;

public class TopProductoDTO {
    private String nombreProducto;
    private long cantidadVendida;

    public TopProductoDTO(String nombreProducto, long cantidadVendida) {
        this.nombreProducto = nombreProducto;
        this.cantidadVendida = cantidadVendida;
    }

    // Getters y Setters
    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public long getCantidadVendida() {
        return cantidadVendida;
    }

    public void setCantidadVendida(long cantidadVendida) {
        this.cantidadVendida = cantidadVendida;
    }
}
