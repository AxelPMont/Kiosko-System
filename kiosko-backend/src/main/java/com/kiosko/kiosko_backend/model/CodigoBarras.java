package com.kiosko.kiosko_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "codigo_barra")
public class CodigoBarras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_codigo_barra")
    private Long idCodigoBarras;

    @Column(nullable = false, unique = true, length = 13)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

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

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
