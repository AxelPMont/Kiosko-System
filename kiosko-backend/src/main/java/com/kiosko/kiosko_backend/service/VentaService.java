package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.VentaRequestDTO;
import com.kiosko.kiosko_backend.dto.VentaResponseDTO;
import com.kiosko.kiosko_backend.model.*;
import com.kiosko.kiosko_backend.repository.*;
import com.kiosko.kiosko_backend.model.Venta.Estado;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CajaRepository cajaRepository;
    private final ProductoRepository productoRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ActividadService actividadService;

    public VentaService(VentaRepository ventaRepository,
                        UsuarioRepository usuarioRepository,
                        CajaRepository cajaRepository,
                        ProductoRepository productoRepository,
                        DetalleVentaRepository detalleVentaRepository, ActividadService actividadService) {
        this.ventaRepository = ventaRepository;
        this.usuarioRepository = usuarioRepository;
        this.cajaRepository = cajaRepository;
        this.productoRepository = productoRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.actividadService = actividadService;
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentas(Boolean soloCompletadas) {
        List<Venta> ventas = Boolean.TRUE.equals(soloCompletadas)
                ? ventaRepository.findByEstado(Estado.COMPLETADA)
                : ventaRepository.findAll();

        return ventas.stream().map(VentaResponseDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVentaActual(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Caja caja = cajaRepository.findByUsuarioIdUsuarioAndFechaCierreIsNull(usuario.getIdUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay una caja abierta"));

        // Buscar una venta activa (no completada)
        Venta venta = ventaRepository.findByCaja(caja)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay una venta activa actualmente"));

        return new VentaResponseDTO(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> buscarPorRangoFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay(); // 2025-09-25T00:00:00
        LocalDateTime fin = fechaFin.atTime(23, 59, 59);  // 2025-09-25T23:59:59

        List<Venta> ventas = ventaRepository.findByFechaHoraBetween(inicio, fin);

        return ventas.stream()
                .map(VentaResponseDTO::new)
                .toList();
    }

    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Caja caja = cajaRepository.findByUsuarioIdUsuarioAndFechaCierreIsNull(usuario.getIdUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caja no encontrada"));

        // Buscar si ya existe una venta asociada a la caja
        Venta venta = ventaRepository.findByCajaIdCaja(caja.getIdCaja())
                .orElseGet(() -> {
                    Venta nuevaVenta = new Venta();
                    nuevaVenta.setUsuario(usuario);
                    nuevaVenta.setCaja(caja);
                    nuevaVenta.setFechaHora(LocalDateTime.now());
                    nuevaVenta.setTotal(BigDecimal.ZERO);
                    return ventaRepository.save(nuevaVenta);
                });

        BigDecimal total = venta.getTotal() != null ? venta.getTotal() : BigDecimal.ZERO;

        for (VentaRequestDTO.DetalleVentaDTO d : request.getDetalles()) {
            Producto producto = productoRepository.findById(d.getIdProducto())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

            if (producto.getStockActual() < d.getCantidad()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Stock insuficiente para " + producto.getNombre());
            }

            // Actualizar stock
            producto.setStockActual(producto.getStockActual() - d.getCantidad());
            productoRepository.save(producto);

            // Crear detalle
            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(d.getCantidad());
            detalle.setPrecioUnitario(d.getPrecioUnitario());
            detalle.setSubtotal(d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())));
            detalleVentaRepository.save(detalle);

            total = total.add(detalle.getSubtotal());
        }

        // Actualizar el total de la venta acumulada
        venta.setTotal(total);
        venta = ventaRepository.save(venta);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "Registró una venta", "lucide:shopping-cart");

        return new VentaResponseDTO(venta);
    }

    @Transactional
    public VentaResponseDTO actualizarVenta(Long id, Venta v) {
        Venta existente = ventaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada"));

        existente.setCaja(v.getCaja());
        existente.setUsuario(v.getUsuario());
        existente.setDetalles(v.getDetalles());
        existente.setTotal(v.getTotal());
        existente.setEstado(v.getEstado());

        return new VentaResponseDTO(ventaRepository.save(existente));
    }

    @Transactional
    public VentaResponseDTO cambiarEstadoVenta(Long id, Estado estado) {
        Venta existente = ventaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada"));
        existente.setEstado(estado);
        return new VentaResponseDTO(ventaRepository.save(existente));
    }

    @Transactional
    public void eliminarVenta(Long id) {
        if (!ventaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada");
        }
        ventaRepository.deleteById(id);
    }
}
