package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.ActividadResponseDTO;
import com.kiosko.kiosko_backend.dto.DashboardResumenDTO;
import com.kiosko.kiosko_backend.dto.VentasSemanaDTO;
import com.kiosko.kiosko_backend.service.ActividadService;
import com.kiosko.kiosko_backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ActividadService actividadService;

    public DashboardController(DashboardService dashboardService, ActividadService actividadService) {
        this.dashboardService = dashboardService;
        this.actividadService = actividadService;
    }

    @GetMapping("/resumen")
    public DashboardResumenDTO obtenerResumen() {
        return dashboardService.obtenerResumen();
    }

    @GetMapping("/ventas-semana")
    public List<VentasSemanaDTO> obtenerVentasSemana() {
        return dashboardService.obtenerVentasSemana();
    }

    @GetMapping("/actividades-recientes")
    public List<ActividadResponseDTO> obtenerActividadesRecientes() {
        return actividadService.listarUltimasActividades();
    }
}