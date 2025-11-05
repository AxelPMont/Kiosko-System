package com.kiosko.kiosko_backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.kiosko.kiosko_backend.model.Venta;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportesRepository extends JpaRepository<Venta, Long> {

    // Ventas agrupadas por día
    @Query(value = """
        SELECT DATE(fecha_hora) as fecha, SUM(total)
        FROM ventas
        WHERE DATE(fecha_hora) BETWEEN :inicio AND :fin
        GROUP BY fecha;
    """, nativeQuery = true)
    List<Object[]> obtenerVentasPorDia(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    // Ventas agrupadas por día
    @Query(value = """
        SELECT COALESCE(SUM(dv.cantidad), 0)
        FROM ventas v
        INNER JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
        WHERE DATE(v.fecha_hora) BETWEEN :inicio AND :fin
    """, nativeQuery = true)
    Long obtenerTransaccionesPorDia(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    // Top productos más vendidos
    @Query(value = """
        SELECT p.nombre, COUNT(dv.id_detalle) as cantidad
        FROM detalle_ventas as dv
        inner JOIN producto p on dv.id_producto=p.id_producto
        inner join ventas v on dv.id_venta = v.id_venta
        WHERE DATE(v.fecha_hora) BETWEEN :inicio AND :fin
        GROUP BY p.nombre
        ORDER BY COUNT(dv.id_detalle) DESC
        LIMIT 5;
    """, nativeQuery = true)
    List<Object[]> obtenerTopProductos(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    // Ventas por categoría
    @Query(value = """
        SELECT c.nombre, SUM(dv.subtotal)
        FROM ventas as v
        INNER JOIN detalle_ventas as dv on v.id_venta=dv.id_venta
        INNER JOIN producto as p on dv.id_producto=p.id_producto
        INNER JOIN categoria_producto as c on p.id_categoria=c.id_categoria
        WHERE date(v.fecha_hora) BETWEEN :inicio AND :fin
        GROUP BY c.nombre;
    """, nativeQuery = true)
    List<Object[]> obtenerVentasPorCategoria(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}