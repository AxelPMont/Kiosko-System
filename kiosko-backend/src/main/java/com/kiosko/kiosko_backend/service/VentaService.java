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

    public VentaResponseDTO obtenerVentaActivaPorUsuario(Long idUsuario) {
        Venta venta = ventaRepository.findVentaActivaByUsuario(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró una venta activa para este usuario"));

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

        Venta venta = ventaRepository.findByCajaIdCaja(caja.getIdCaja())
                .orElseGet(() -> {
                    Venta nuevaVenta = new Venta();
                    nuevaVenta.setUsuario(usuario);
                    nuevaVenta.setCaja(caja);
                    nuevaVenta.setFechaHora(LocalDateTime.now());
                    nuevaVenta.setTotal(BigDecimal.ZERO);
                    return ventaRepository.save(nuevaVenta);
                });

        for (VentaRequestDTO.DetalleVentaDTO d : request.getDetalles()) {
            Producto producto = productoRepository.findById(d.getIdProducto())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

            if (producto.getStockActual() < d.getCantidad()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Stock insuficiente para " + producto.getNombre());
            }

            DetalleVenta detalleExistente = detalleVentaRepository
                    .findByVentaIdVentaAndProductoIdProducto(venta.getIdVenta(), producto.getIdProducto())
                    .orElse(null);

            if (detalleExistente != null) {
                int nuevaCantidad = detalleExistente.getCantidad() + d.getCantidad();
                detalleExistente.setCantidad(nuevaCantidad);
                detalleExistente.setSubtotal(detalleExistente.getPrecioUnitario().multiply(BigDecimal.valueOf(nuevaCantidad)));
                detalleVentaRepository.save(detalleExistente);
            } else {
                DetalleVenta nuevoDetalle = new DetalleVenta();
                nuevoDetalle.setVenta(venta);
                nuevoDetalle.setProducto(producto);
                nuevoDetalle.setCantidad(d.getCantidad());
                nuevoDetalle.setPrecioUnitario(d.getPrecioUnitario());
                nuevoDetalle.setSubtotal(d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())));
                detalleVentaRepository.save(nuevoDetalle);
            }

            // 🔽 Actualizar stock del producto
            producto.setStockActual(producto.getStockActual() - d.getCantidad());
            productoRepository.save(producto);
        }

        BigDecimal totalActualizado = detalleVentaRepository.findByVentaIdVenta(venta.getIdVenta())
                .stream()
                .map(DetalleVenta::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        venta.setTotal(totalActualizado);
        ventaRepository.save(venta);

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
