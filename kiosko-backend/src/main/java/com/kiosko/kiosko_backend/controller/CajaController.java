package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.CajaRequestDTO;
import com.kiosko.kiosko_backend.dto.CajaResponseDTO;
import com.kiosko.kiosko_backend.service.CajaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/caja")
public class CajaController {

    private final CajaService cajaService;

    public CajaController(CajaService cajaService) {
        this.cajaService = cajaService;
    }

    @GetMapping
    public List<CajaResponseDTO> listarCajas() {
        return cajaService.listarCajas();
    }

    @PostMapping("/abrir")
    @ResponseStatus(HttpStatus.CREATED)
    public CajaResponseDTO abrirCaja(@Valid @RequestBody CajaRequestDTO request) {
        return cajaService.abrirCaja(request);
    }

    @PutMapping("/{id}/cerrar")
    public CajaResponseDTO cerrarCaja(@PathVariable Long id, @RequestParam BigDecimal montoCierre) {
        return cajaService.cerrarCaja(id, montoCierre);
    }
}