package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.CategoriaProductoRequestDTO;
import com.kiosko.kiosko_backend.dto.CategoriaProductoResponseDTO;
import com.kiosko.kiosko_backend.service.CategoriaProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria-producto")
public class CategoriaProductoController {

    private final CategoriaProductoService categoriaProductoService;

    public CategoriaProductoController(CategoriaProductoService categoriaProductoService) {
        this.categoriaProductoService = categoriaProductoService;
    }

    @GetMapping
    public List<CategoriaProductoResponseDTO> listarCategorias() {
        return categoriaProductoService.listarCategorias();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaProductoResponseDTO registrarCategoria(@Valid @RequestBody CategoriaProductoRequestDTO request) {
        return categoriaProductoService.registrarCategoria(request);
    }

    @PutMapping("/{id}")
    public CategoriaProductoResponseDTO actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaProductoRequestDTO request) {
        return categoriaProductoService.actualizarCategoria(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCategoria(@PathVariable Long id) {
        categoriaProductoService.eliminarCategoria(id);
    }
}