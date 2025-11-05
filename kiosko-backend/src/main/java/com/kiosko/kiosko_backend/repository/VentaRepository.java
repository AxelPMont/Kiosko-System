package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.Caja;
import com.kiosko.kiosko_backend.model.Venta;
import com.kiosko.kiosko_backend.model.Venta.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByEstado(Estado estado);
    List<Venta> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    Optional<Venta> findByCajaIdCaja(Long idCaja);

    @Query(value = "SELECT COALESCE(SUM(total), 0) FROM ventas WHERE DATE(fecha_hora) = :date", nativeQuery = true)
    BigDecimal sumTotalByDate(@Param("date") LocalDate date);

    @Query(value = """
    SELECT DATE(fecha_hora) AS fecha, COALESCE(SUM(total), 0) AS total
    FROM ventas
    WHERE fecha_hora >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(fecha_hora)
    ORDER BY DATE(fecha_hora) ASC
    """, nativeQuery = true)
    List<Object[]> getVentasUltimos7Dias();

    @Query(value = """
    SELECT v.*
    FROM Ventas AS v
    INNER JOIN Caja AS c ON v.id_caja = c.id_caja
    INNER JOIN Usuario AS u ON c.id_usuario = u.id_usuario
    WHERE u.id_usuario = :idUsuario AND c.fecha_cierre IS NULL
    """, nativeQuery = true)
    Optional<Venta> findVentaActivaByUsuario(@Param("idUsuario") Long idUsuario);
}