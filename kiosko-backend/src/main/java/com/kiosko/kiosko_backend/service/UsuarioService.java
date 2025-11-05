package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.UsuarioRequestDTO;
import com.kiosko.kiosko_backend.dto.UsuarioResponseDTO;
import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActividadService actividadService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, ActividadService actividadService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.actividadService = actividadService;
    }

    @Transactional
    public UsuarioResponseDTO registrarUsuario(UsuarioRequestDTO request) {
        String claveEncriptada = passwordEncoder.encode(request.getClave());
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setClave(claveEncriptada);
        usuario.setRol(request.getRol());
        usuario.setEstado(request.getEstado());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "registró un nuevo usuario", "lucide:user-plus");

        return new UsuarioResponseDTO(usuarioGuardado);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

//    @Transactional
//    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO request) {
//        Usuario existente = usuarioRepository.findById(id)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
//
//        existente.setNombreUsuario(request.getNombreUsuario());
//        existente.setNombreCompleto(request.getNombreCompleto());
//        if (request.getClave() != null && !request.getClave().trim().isEmpty()) {
//            existente.setClave(passwordEncoder.encode(request.getClave()));
//        }
//        existente.setRol(request.getRol());
//        existente.setEstado(request.getEstado());
//
//        return new UsuarioResponseDTO(usuarioRepository.save(existente));
//    }

    @Transactional
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public UsuarioResponseDTO cambiarEstado(Long id, String nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        try {
            usuario.setEstado(Usuario.Estado.valueOf(nuevoEstado.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido");
        }

        usuarioRepository.save(usuario);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "Cambió el estado de "+ usuario.getNombreUsuario() + " a " + nuevoEstado, "lucide:user");

        return new UsuarioResponseDTO(usuario);
    }
}