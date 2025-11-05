package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.CajaRequestDTO;
import com.kiosko.kiosko_backend.dto.CajaResponseDTO;
import com.kiosko.kiosko_backend.model.Caja;
import com.kiosko.kiosko_backend.model.Caja.Estado;
import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.repository.CajaRepository;
import com.kiosko.kiosko_backend.repository.UsuarioRepository;
import com.kiosko.kiosko_backend.repository.VentaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CajaService {

    private final CajaRepository cajaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ActividadService actividadService;
    private final VentaRepository ventaRepository;

    public CajaService(CajaRepository cajaRepository, UsuarioRepository usuarioRepository, ActividadService actividadService, VentaRepository ventaRepository) {
        this.cajaRepository = cajaRepository;
        this.usuarioRepository = usuarioRepository;
        this.actividadService = actividadService;
        this.ventaRepository = ventaRepository;
    }

    @Transactional
    public CajaResponseDTO abrirCaja(CajaRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (cajaRepository.findByUsuarioIdUsuarioAndFechaCierreIsNull(usuario.getIdUsuario()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya tiene una caja abierta");
        }

        Caja caja = new Caja();
        caja.setUsuario(usuario);
        caja.setFechaApertura(LocalDateTime.now());
        caja.setMontoApertura(request.getMontoApertura());
        caja.setEstado(Estado.ABIERTA);

        Caja cajaGuardada = cajaRepository.save(caja);

        actividadService.registrarActividad(username, "Abrió caja", "lucide:box");

        return new CajaResponseDTO(cajaGuardada);
    }

    @Transactional
    public CajaResponseDTO cerrarCaja(Long idCaja, BigDecimal montoCierreManual) {
        Caja caja = cajaRepository.findById(idCaja)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caja no encontrada"));

        if (caja.getEstado() == Estado.CERRADA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La caja ya está cerrada");
        }

        // Obtener todas las ventas de esta caja
        BigDecimal totalVentas = ventaRepository.findByCajaIdCaja(idCaja)
                .stream()
                .map(v -> v.getTotal() != null ? v.getTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calcular el monto total de cierre
        BigDecimal montoCierre = caja.getMontoApertura().add(totalVentas);

        caja.setFechaCierre(LocalDateTime.now());
        caja.setMontoCierre(montoCierre);
        caja.setEstado(Estado.CERRADA);

        Caja cajaGuardada = cajaRepository.save(caja);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "Cerró caja", "lucide:clipboard-check");

        return new CajaResponseDTO(cajaGuardada);
    }

    @Transactional(readOnly = true)
    public List<CajaResponseDTO> listarCajas() {
        return cajaRepository.findAll().stream()
                .map(CajaResponseDTO::new)
                .collect(Collectors.toList());
    }
}