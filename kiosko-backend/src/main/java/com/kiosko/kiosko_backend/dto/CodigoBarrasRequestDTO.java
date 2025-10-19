package com.kiosko.kiosko_backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CodigoBarrasRequestDTO {

    @NotBlank(message = "El código de barras no puede estar vacío")
    @Size(min = 8, max = 13, message = "El código de barras debe tener entre 8 y 13 dígitos")
    @Pattern(regexp = "\\d+", message = "El código de barras solo puede contener números")
    private String codigo;

    @NotNull(message = "Debe especificar el ID del producto")
    private Long idProducto;

    //Getters y Setters
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
}
