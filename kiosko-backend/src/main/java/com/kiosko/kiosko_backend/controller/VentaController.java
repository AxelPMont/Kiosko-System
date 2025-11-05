package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.VentaRequestDTO;
import com.kiosko.kiosko_backend.dto.VentaResponseDTO;
import com.kiosko.kiosko_backend.model.Venta;
import com.kiosko.kiosko_backend.model.Venta.Estado;
import com.kiosko.kiosko_backend.repository.VentaRepository;
import com.kiosko.kiosko_backend.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/venta")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public List<VentaResponseDTO> listarVentas(@RequestParam(value = "soloCompletadas", required = false) Boolean soloCompletadas) {
        return ventaService.listarVentas(soloCompletadas);
    }

    @GetMapping("/activa/{idUsuario}")
    public ResponseEntity<VentaResponseDTO> obtenerVentaActiva(@PathVariable Long idUsuario) {
        VentaResponseDTO ventaActiva = ventaService.obtenerVentaActivaPorUsuario(idUsuario);
        return ResponseEntity.ok(ventaActiva);
    }

    @GetMapping("/rango-fecha")
    public List<VentaResponseDTO> buscarPorRangoFecha(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ventaService.buscarPorRangoFecha(fechaInicio, fechaFin);
    }

    @PostMapping("/registrar")
    @ResponseStatus(HttpStatus.CREATED)
    public VentaResponseDTO registrarVenta(@RequestBody VentaRequestDTO request) {
        return ventaService.registrarVenta(request);
    }
}