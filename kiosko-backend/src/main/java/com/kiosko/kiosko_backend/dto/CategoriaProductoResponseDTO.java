package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.CategoriaProducto;

public class CategoriaProductoResponseDTO {

    private Long idCategoria;
    private String nombre;

    public CategoriaProductoResponseDTO(CategoriaProducto categoria) {
        this.idCategoria = categoria.getIdCategoria();
        this.nombre = categoria.getNombre();
    }

    //Getters
    public Long getIdCategoria() {
        return idCategoria;
    }

    public String getNombre() {
        return nombre;
    }
}