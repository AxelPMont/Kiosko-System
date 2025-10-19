package com.kiosko.kiosko_backend.dto;

public class CategoriaProductoResumenDTO {

    private String nombreCategoria;
    private Long cantidadProductos;

    public CategoriaProductoResumenDTO(String nombreCategoria, Long cantidadProductos) {
        this.nombreCategoria = nombreCategoria;
        this.cantidadProductos = cantidadProductos;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public Long getCantidadProductos() {
        return cantidadProductos;
    }
}
