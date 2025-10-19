package com.kiosko.kiosko_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CajaRequestDTO {

    @NotNull(message = "El monto de apertura es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El monto de apertura no puede ser negativo")
    @Digits(integer = 10, fraction = 2, message = "Formato inválido (hasta 2 decimales)")
    private BigDecimal montoApertura;

    //Getters y Setters
    public BigDecimal getMontoApertura() {
        return montoApertura;
    }
    public void setMontoApertura(BigDecimal montoApertura) {
        this.montoApertura = montoApertura;
    }
}
