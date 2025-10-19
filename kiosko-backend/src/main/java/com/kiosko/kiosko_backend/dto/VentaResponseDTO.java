package com.kiosko.kiosko_backend.dto;

import com.kiosko.kiosko_backend.model.Venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class VentaResponseDTO {

    private Long id;
    private LocalDateTime fechaHora;
    private BigDecimal total;
    private String estado;
    private String usuario;
    private String caja;
    private List<DetalleVentaResponseDTO> detalles = new ArrayList<>();

    public VentaResponseDTO(Venta venta) {
        this.id = venta.getIdVenta();
        this.fechaHora = venta.getFechaHora();
        this.total = venta.getTotal();
        this.estado = venta.getEstado().name();
        this.usuario = venta.getUsuario() != null ? venta.getUsuario().getNombreUsuario() : null;
        this.caja = venta.getCaja() != null ? "Caja " + venta.getCaja().getIdCaja() : null;
        if (venta.getDetalles() != null) {
            this.detalles = venta.getDetalles().stream()
                    .map(DetalleVentaResponseDTO::new)
                    .toList();
        }
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getCaja() { return caja; }
    public void setCaja(String caja) { this.caja = caja; }

    public List<DetalleVentaResponseDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaResponseDTO> detalles) { this.detalles = detalles; }
}