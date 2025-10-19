package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.CodigoBarrasRequestDTO;
import com.kiosko.kiosko_backend.dto.CodigoBarrasResponseDTO;
import com.kiosko.kiosko_backend.service.CodigoBarrasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codigo-barras")
public class CodigoBarrasController {

    private final CodigoBarrasService codigoBarrasService;

    public CodigoBarrasController(CodigoBarrasService codigoBarrasService) {
        this.codigoBarrasService = codigoBarrasService;
    }

    @GetMapping
    public List<CodigoBarrasResponseDTO> listarCodigosBarras() {
        return codigoBarrasService.listarCodigosBarras();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CodigoBarrasResponseDTO registrarCodigoBarras(@Valid @RequestBody CodigoBarrasRequestDTO request) {
        return codigoBarrasService.registrarCodigoBarras(request);
    }

    @PutMapping("/{id}")
    public CodigoBarrasResponseDTO actualizarCodigoBarras(
            @PathVariable Long id,
            @Valid @RequestBody CodigoBarrasRequestDTO request) {
        return codigoBarrasService.actualizarCodigoBarras(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCodigoBarras(@PathVariable Long id) {
        codigoBarrasService.eliminarCodigoBarras(id);
    }
}