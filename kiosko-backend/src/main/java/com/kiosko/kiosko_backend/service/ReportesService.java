package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.ReporteVentasDTO;
import com.kiosko.kiosko_backend.dto.TopProductoDTO;
import com.kiosko.kiosko_backend.dto.VentasPorCategoriaDTO;
import com.kiosko.kiosko_backend.dto.VentasPorDiaDTO;
import com.kiosko.kiosko_backend.repository.ReportesRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportesService {

    private final ReportesRepository reportesRepository;

    public ReportesService(ReportesRepository reportesRepository) {
        this.reportesRepository = reportesRepository;
    }

    public ReporteVentasDTO generarReporte(LocalDate inicio, LocalDate fin) {
        List<Object[]> ventasRaw = reportesRepository.obtenerVentasPorDia(inicio, fin);
        List<VentasPorDiaDTO> ventasPorDia = ventasRaw.stream()
                .map(obj -> new VentasPorDiaDTO(
                        ((Date) obj[0]).toLocalDate(),
                        ((BigDecimal) obj[1]).doubleValue()
                ))
                .collect(Collectors.toList());

        List<Object[]> topRaw = reportesRepository.obtenerTopProductos(inicio, fin);
        List<TopProductoDTO> topProductos = topRaw.stream()
                .map(obj -> new TopProductoDTO(
                        (String) obj[0],
                        ((Number) obj[1]).intValue()
                ))
                .collect(Collectors.toList());

        List<Object[]> categoriaRaw = reportesRepository.obtenerVentasPorCategoria(inicio, fin);
        List<VentasPorCategoriaDTO> ventasPorCategoria = categoriaRaw.stream()
                .map(obj -> new VentasPorCategoriaDTO(
                        (String) obj[0],
                        ((BigDecimal) obj[1]).doubleValue()
                ))
                .collect(Collectors.toList());

        double totalVentas = ventasPorDia.stream().mapToDouble(VentasPorDiaDTO::getTotal).sum();
        long totalTransacciones = reportesRepository.obtenerTransaccionesPorDia(inicio, fin);
        double ticketPromedio = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

        ReporteVentasDTO dto = new ReporteVentasDTO();
        dto.setVentasPorDia(ventasPorDia);
        dto.setTopProductos(topProductos);
        dto.setVentasPorCategoria(ventasPorCategoria);
        dto.setTotalVentas(totalVentas);
        dto.setTotalTransacciones(totalTransacciones);
        dto.setTicketPromedio(ticketPromedio);

        return dto;
    }
}