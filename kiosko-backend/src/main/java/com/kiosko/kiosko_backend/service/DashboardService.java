package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.DashboardResumenDTO;
import com.kiosko.kiosko_backend.dto.VentasSemanaDTO;
import com.kiosko.kiosko_backend.model.Usuario;
import com.kiosko.kiosko_backend.repository.ProductoRepository;
import com.kiosko.kiosko_backend.repository.UsuarioRepository;
import com.kiosko.kiosko_backend.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardService(VentaRepository ventaRepository,
                            ProductoRepository productoRepository,
                            UsuarioRepository usuarioRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResumenDTO obtenerResumen() {
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);

        BigDecimal ventasHoyBd = ventaRepository.sumTotalByDate(hoy);
        BigDecimal ventasAyerBd = ventaRepository.sumTotalByDate(ayer);

        double ventasHoy = ventasHoyBd == null ? 0.0 : ventasHoyBd.doubleValue();
        double ventasAyer = ventasAyerBd == null ? 0.0 : ventasAyerBd.doubleValue();

        double variacion = 0.0;
        if (ventasAyer > 0) {
            variacion = ((ventasHoy - ventasAyer) / ventasAyer) * 100.0;
        }

        long totalProductos = productoRepository.count();
        long productosBajoStock = productoRepository.countProductosBajoStock();
        long totalUsuarios = usuarioRepository.count();
        long administradores = usuarioRepository.countByRol(Usuario.Rol.ADMINISTRADOR);

        // Para "alertas" ahora usamos la cantidad de productos en bajo stock (puedes cambiarlo)
        long alertas = productosBajoStock;

        return new DashboardResumenDTO(
                ventasHoy,
                Math.round(variacion * 100.0) / 100.0, // redondear a 2 decimales opcional
                totalProductos,
                productosBajoStock,
                totalUsuarios,
                administradores,
                alertas
        );
    }

    @Transactional(readOnly = true)
    public List<VentasSemanaDTO> obtenerVentasSemana() {
        List<Object[]> resultados = ventaRepository.getVentasUltimos7Dias();

        // Convertimos los resultados a DTOs con nombres de días
        return resultados.stream()
                .map(obj -> new VentasSemanaDTO(
                        ((java.sql.Date) obj[0]).toLocalDate(),
                        ((Number) obj[1]).doubleValue()
                ))
                .toList();
    }
}