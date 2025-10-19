package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.ReporteVentasDTO;
import com.kiosko.kiosko_backend.service.ReportesService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    private final ReportesService reportesService;

    public ReportesController(ReportesService reportesService) {
        this.reportesService = reportesService;
    }

    @GetMapping("/ventas")
    public ReporteVentasDTO obtenerReporteVentas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return reportesService.generarReporte(inicio, fin);
    }
}