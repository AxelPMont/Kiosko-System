package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.DetalleVentaResponseDTO;
import com.kiosko.kiosko_backend.repository.DetalleVentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;

    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    public List<DetalleVentaResponseDTO> listarPorVenta(Long idVenta) {
        return detalleVentaRepository.findByVentaIdVenta(idVenta)
                .stream()
                .map(DetalleVentaResponseDTO::new)
                .toList();
    }
}
