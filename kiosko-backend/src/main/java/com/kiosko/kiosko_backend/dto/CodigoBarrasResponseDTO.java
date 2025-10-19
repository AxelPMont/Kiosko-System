package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.CodigoBarras;

public class CodigoBarrasResponseDTO {

    private Long idCodigoBarras;
    private String codigo;
    private Long idProducto;
    private String nombreProducto;

    public CodigoBarrasResponseDTO(CodigoBarras codigoBarras) {
        this.idCodigoBarras = codigoBarras.getIdCodigoBarras();
        this.codigo = codigoBarras.getCodigo();
        this.idProducto = codigoBarras.getProducto().getIdProducto();
        this.nombreProducto = codigoBarras.getProducto().getNombre();
    }

    //Getters y Setters
    public Long getIdCodigoBarras() {
        return idCodigoBarras;
    }

    public void setIdCodigoBarras(Long idCodigoBarras) {
        this.idCodigoBarras = idCodigoBarras;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }
}
