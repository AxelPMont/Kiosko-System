package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    List<DetalleVenta> findByVentaIdVenta(Long idVenta);
    boolean existsByProducto_IdProducto(Long idProducto);
}