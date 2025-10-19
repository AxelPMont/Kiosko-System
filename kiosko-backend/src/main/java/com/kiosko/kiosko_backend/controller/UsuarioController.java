package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.UsuarioRequestDTO;
import com.kiosko.kiosko_backend.dto.UsuarioResponseDTO;
import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.model.Usuario.Estado;
import com.kiosko.kiosko_backend.repository.UsuarioRepository;
import com.kiosko.kiosko_backend.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO registrarUsuario(@Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.registrarUsuario(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDTO actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequestDTO request) {
        return usuarioService.actualizarUsuario(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
    }

    @PatchMapping("/{id}/estado")
    public UsuarioResponseDTO cambiarEstado(
            @PathVariable Long id,
            @RequestParam("estado") String nuevoEstado) {
        return usuarioService.cambiarEstado(id, nuevoEstado);
    }
}
