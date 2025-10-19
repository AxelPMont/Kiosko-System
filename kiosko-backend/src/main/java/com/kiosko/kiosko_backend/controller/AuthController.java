package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.config.JwtUtil;
import com.kiosko.kiosko_backend.dto.LoginRequestDTO;
import com.kiosko.kiosko_backend.dto.LoginResponseDTO;
import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(request.getNombreUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        if (usuario.getEstado() == Usuario.Estado.INACTIVO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tu cuenta está inactiva. Contacta al administrador.");
        }

        if (!passwordEncoder.matches(request.getClave(), usuario.getClave())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Clave incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getNombreUsuario());

        return new LoginResponseDTO(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getNombreCompleto(),
                usuario.getRol().name(),
                token
        );
    }
}
