package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.CodigoBarras;
import com.kiosko.kiosko_backend.model.Producto;
import com.kiosko.kiosko_backend.model.Producto.Estado;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class ProductoResponseDTO {

    private Long idProducto;
    private String nombre;
    private Estado estado;
    private BigDecimal precio;
    private Integer stockActual;
    private Integer stockMinimo;
    private String categoria;
    private List<String> codigosBarras;

    public ProductoResponseDTO(Producto producto) {
        this.idProducto = producto.getIdProducto();
        this.nombre = producto.getNombre();
        this.estado = producto.getEstado();
        this.precio = producto.getPrecio();
        this.stockActual = producto.getStockActual();
        this.stockMinimo = producto.getStockMinimo();
        this.categoria = producto.getCategoria().getNombre();
        this.codigosBarras = producto.getCodigosBarras()
                .stream()
                .map(CodigoBarras::getCodigo)
                .collect(Collectors.toList());
    }

    //Getters y Setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public List<String> getCodigosBarras() {
        return codigosBarras;
    }

    public void setCodigosBarras(List<String> codigosBarras) {
        this.codigosBarras = codigosBarras;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}
