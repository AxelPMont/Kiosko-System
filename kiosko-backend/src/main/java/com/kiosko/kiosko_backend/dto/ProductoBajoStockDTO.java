package com.kiosko.kiosko_backend.dto;

public class ProductoBajoStockDTO {
    private String nombreProducto;
    private int stockActual;
    private int stockMinimo;

    public ProductoBajoStockDTO(String nombreProducto, int stockActual, int stockMinimo) {
        this.nombreProducto = nombreProducto;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public int getStockActual() {
        return stockActual;
    }

    public int getStockMinimo() {
        return stockMinimo;
    }
}