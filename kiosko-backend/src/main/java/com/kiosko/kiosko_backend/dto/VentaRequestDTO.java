package com.kiosko.kiosko_backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class VentaRequestDTO {

    @NotNull(message = "El usuario es obligatorio")
    private Long idUsuario;

    @NotEmpty(message = "Debe tener al menos un detalle")
    private List<DetalleVentaDTO> detalles;

    public static class DetalleVentaDTO {
        @NotNull(message = "El producto es obligatorio")
        private Long idProducto;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad;

        @NotNull(message = "El precio unitario es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
        @Digits(integer = 10, fraction = 2, message = "Formato inválido (hasta 2 decimales)")
        private BigDecimal precioUnitario;

        // Getters y Setters
        public Long getIdProducto() {
            return idProducto;
        }

        public void setIdProducto(Long idProducto) {
            this.idProducto = idProducto;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }

        public BigDecimal getPrecioUnitario() {
            return precioUnitario;
        }

        public void setPrecioUnitario(BigDecimal precioUnitario) {
            this.precioUnitario = precioUnitario;
        }
    }

    // Getters y Setters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<DetalleVentaDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVentaDTO> detalles) {
        this.detalles = detalles;
    }
}