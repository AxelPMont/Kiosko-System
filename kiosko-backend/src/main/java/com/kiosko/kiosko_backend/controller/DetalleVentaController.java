package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.DetalleVentaResponseDTO;
import com.kiosko.kiosko_backend.service.DetalleVentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-venta")
public class DetalleVentaController {

    private final DetalleVentaService detalleVentaService;

    public DetalleVentaController(DetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @GetMapping("/venta/{idVenta}")
    public List<DetalleVentaResponseDTO> listarPorVenta(@PathVariable Long idVenta) {
        return detalleVentaService.listarPorVenta(idVenta);
    }
}